'use strict';

import { SQLRecords, MakeId } from './helpers';


Array.prototype.equals = function (array) {
  if (!array)
    return false;

  if (this.length != array.length)
    return false;

  for (var i = 0, l=this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i]))
        return false;       
    }           
    else if (this[i] != array[i]) { 
      return false;   
    }           
  }       
  return true;
}
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}


class App {
  constructor ({ idRegistro, idPregunta, max, nameServer, selector }){
    this.arguments = {
      selector,
      idRegistro: (idRegistro || MakeId() ),
      idPregunta: (idPregunta || MakeId() ),
      max: (max || 10000 ),
      nameServer: (nameServer || undefined ),
    };
    this.audio = {};
    this.DB;
    this.cordovaDir = '';
    // Default Icons
    this.icons = {
      playIcon: this.getIcon('play_arrow'),
      stopIcon: this.getIcon('pause'),
      deleteIcon: this.getIcon('clear')
    };
    // Default strings
    this.strings = {
      recording: 'Detener grabación',
      stoprecord: 'Grabar audio',
      mjsrecord: 'Grabando audio....',
      mjsdivrecord: 'grabando ....',
      alertmaxrecord: ' Llegó al máximo de grabaciones posibles ',
      dialogconfirm: 'Está seguro de eliminar el archivo ',
      fields: 'id,name,path,idRegistro,idPregunta,type,duration,date',
      tablename: 'RECORDS',
    };
    this.record = { recording: false };
  }

  getIcon(icon){
    return `<i class="material-icons md-18">${icon}</i>`; 
  }

  init(){
    let rec = this.recordAudio.bind(this);
    let agrs = this.arguments;
    this.cordovaDir = cordova.file.externalDataDirectory;
    let btn = $(''+this.arguments.selector);
    btn.click( evt => rec( agrs ) );
    this.strings = {
      recording: ( btn.data('recording') || this.strings.recording ),
      stoprecord: ( btn.data('stoprecord') || this.strings.stoprecord ),
      mjsrecord: ( btn.data('mjsrecord') || this.strings.mjsrecord ),
      mjsdivrecord: `<div class="mensaje alignAbsoluteCenter ${this.arguments.idRegistro} ${this.arguments.idPregunta}">${( btn.data('mjsdivrecord') || this.strings.mjsdivrecord )}</div>`,
      alertmaxrecord: ( btn.data('alertmaxrecord') || this.strings.alertmaxrecord ),
      dialogconfirm: ( btn.data('dialogconfirm') || this.strings.dialogconfirm ),
      fields: ( btn.data('fields') || this.strings.fields ),
      tablename: ( btn.data('tablename') || this.strings.tablename ),
    }
    this.icons = {
      playIcon: ( btn.data('playicon') || this.icons.playIcon ),
      stopIcon: ( btn.data('stopicon') || this.icons.stopIcon ),
      deleteIcon: ( btn.data('deleteicon') || this.icons.deleteIcon )
    }
    this.DB = new SQLRecords({name: 'RecordMedia', description: 'Save records media', size: 64 * 1024,
      table: {name: this.strings.tablename, fields: this.strings.fields.split(',') },
      app: this.arguments,
    });
    btn.after(this.strings.mjsdivrecord);
    this.initView.bind(this)();
  }

  initView( ){
    // JS form
    let medias = document.querySelector('#content-'+this.arguments.idRegistro+'_'+this.arguments.idPregunta);
    if( medias != undefined )
      medias.innerHTML = ''
    // jQuery form
    // $('#content-'+this.arguments.idRegistro+'_'+this.arguments.idPregunta).empty();
    this.DB.getAllValuesAsId( songs => {
      let addAudioView = this.addAudioView.bind(this);
      let arraySongs = Object.keys(songs);
      if(arraySongs.length > 0){
        for (var i = 0; i < arraySongs.length; i++) {
          songs[arraySongs[i]].selector = this.arguments.selector;
          songs[arraySongs[i]].max = this.arguments.max;
          addAudioView(songs[arraySongs[i]]);
        }
      }
    });
  }


  changeIconView(id, icon){
    document.getElementsByClassName('play '+id)[0].innerHTML = icon;
    // jQuery Form
    // $('.play.'+id).html(icon);
  }

  playPauseAudio( { id, path, name, selector, idRegistro, idPregunta, max } ){
    let playIcon = this.icons.playIcon;
    let stopIcon = this.icons.stopIcon;
    let changeIconView = this.changeIconView;
    let element = document.getElementsByClassName('range ex1-'+id)[0];
    let dur = 100;
    let stopState = stopStateFunc.bind(this);
    let playState = playStateFunc.bind(this);
    let mediaTimer = ()=>{};

    if( this.audio && this.audio.id == id && this.audio.estado != 'pause'){
      stopState()
    }else if( this.audio && this.audio.id == id && this.audio.estado == 'pause' ){
      playState();
    }else{
      this.audio = {};
      this.audio.media = new Media( path,
        e => { console.log('Success ',e); changeIconView(id, stopIcon); },
        err => { changeIconView(id, playIcon); },
        e => { 
          console.log('Status ', e); 
          if( e == 3 ){
            stopState( this.audio.media._position * 100 ); 
          }else if( e == 4 ) { 
            this.DB.updateValueById( {field:'duration' , value: this.audio.media._duration, id } ); 
            stopState( 0 ); 
          }
        }
      );
      playState();
    }


    function playStateFunc(){
      this.audio.id = id;
      this.audio.estado = 'play';
      this.audio.media.play();
      changeIconView(id, stopIcon);
      // element.value = 0;
      mediaTimer = setInterval( () => {
        dur = this.audio.media.getDuration() * 100 ;
        dur = dur <= 0 ? (-1*dur) : dur;
        element.max = dur;

        this.audio.media.getCurrentPosition(
          position => {
            let pos = position * 100;

            if(pos <= 0 || this.audio.estado == 'pause' ){
              stopState( 0 )
            }else{
              this.audio.pos = pos;
              element.value = pos;
            }
          },
          e => {
            console.log("Error getting pos=" + e);
          }
        );
        
        if (dur == 0 || this.audio.estado == 'pause' ){
          stopState( 0 );//{audio: this.audio, element })
        }
      }, 500)
    }

    function stopStateFunc( pos ){
      this.audio.estado = 'pause';
      this.audio.media.pause();
      clearInterval(mediaTimer);
      element.value = (typeof pos == 'number' ? pos : this.audio.pos);
      changeIconView(id, playIcon);
    }

  }
  removeAudio( { id, path, name, selector, idRegistro, idPregunta, max } ){

    if(confirm(this.strings.dialogconfirm+' '+name)){
      window.resolveLocalFileSystemURL( this.cordovaDir, dir => {
        dir.getFile(name , { create: true }, file => {
          file.remove( files =>{
            this.DB.deleteValue({field: 'id', value: id }, res => {
              if( res == 'ok'){
                document.getElementsByClassName(`MediaRecord-media ${id}`)[0].remove();
                // document.querySelector('#content-'+idRegistro+'_'+idPregunta).remove()
                // jQuery Form
                // $('#content-'+idRegistro+'_'+idPregunta).remove();
                // this.initView();
                console.log("File removed! ", files);
              }
            });
          }, () => {
            console.log("error deleting the file " + error.code);
          });
        });
      });
    }

  }

  recordAudio({ selector, idRegistro, idPregunta, max }){
    let store = this.cordovaDir; //externalApplicationStorageDirectory; // window.externalApplicationStorageDirectory || window.PERSISTENT || window.TEMPORARY;
    let id = Date.now();
    let name =   idRegistro + '_' + idPregunta + '__' + id +'.amr';
    let path = store + name;
    this.DB.getAllValuesAsId( songs => {
      let lengthSongs = songs.length || ( typeof songs == 'object' ? Object.keys(songs).length : 0)
      if( lengthSongs >= max ){
        alert(this.strings.alertmaxrecord);
      }else{
        if( this.record.recording == true ){
          this.record.media.stopRecord();
          this.record.recording = false;
          this.stopRecordView.bind(this)( selector );
        }else{
          let addAudio = this.addAudio.bind(this);
          let upload = this.upload.bind(this);

          this.record.recording = true;
          this.record.media = new Media( path , 
            e => { 
              addAudio({ id, path, name, selector, idRegistro, idPregunta, max }); 
              if( this.arguments.nameServer != undefined )
                setTimeout( () => upload({ id, path, name, selector, idRegistro, idPregunta, max }),0); 
            }, 
            e => console.log(e) );
          this.record.media.startRecord();
          this.startRecordView.bind(this)( selector );
        }
      }
      
    } );

  }

  addAudio({ id, path, name, selector, idRegistro, idPregunta, max }){
    // ['id', 'name', 'path', 'idRegistro', 'idPregunta', 'type', 'duration', 'date']
    let date = new Date().getTime();
    this.DB.insertValue( [id, name, path, idRegistro, idPregunta, 'audio', '4.0', date ] ); 
    this.addAudioView.bind(this)({ id, path, name, selector, idRegistro, idPregunta, max, date })
  }

  startRecordView( selector ){
    document.querySelector( selector + '').innerHTML = this.strings.recording;
    document.getElementsByClassName( 'mensaje '+this.arguments.idRegistro+' '+this.arguments.idPregunta)[0]
      .style.visibility = 'visible';
    // jQuery form
    // $('.mensaje.'+this.arguments.idRegistro+'.'+this.arguments.idPregunta).css('visibility','visible')
  }

  stopRecordView( selector ){
    document.querySelector( selector + '').innerHTML = this.strings.stoprecord;
    document.getElementsByClassName( 'mensaje '+this.arguments.idRegistro+' '+this.arguments.idPregunta)[0]
      .style.visibility = 'hidden';
    // jQuery form
    // $('.mensaje.'+this.arguments.idRegistro+'.'+this.arguments.idPregunta).css('visibility','hidden');
  }

  addAudioView( audio ){

    let playPauseAudio = this.playPauseAudio.bind(this);
    let removeAudio = this.removeAudio.bind(this);
    let template = this.templateAudio.bind(this)(audio);

    // JS Form
    let reg = document.querySelector( '#content-'+audio.idRegistro+'_'+audio.idPregunta);
    if( reg == undefined ){
      let btnAudio = document.querySelector( ''+audio.selector );
      let father = btnAudio.parentElement;
      let playList = document.createElement('div');
          playList.id = "content-"+audio.idRegistro+"_"+audio.idPregunta;
      father.insertBefore(playList, btnAudio);
    }

    document.querySelector( '#content-'+audio.idRegistro+'_'+audio.idPregunta)
      .insertAdjacentHTML('beforeend', template)

    document.getElementsByClassName('play ' + audio.id)[0]
      .addEventListener('click', () => playPauseAudio(audio) , false );
      document.getElementsByClassName('remove ' + audio.id)[0]
      .addEventListener('click', () => removeAudio(audio) , false );

    // jQuery Form

    // let reg = $('div#content-'+audio.idRegistro+'_'+audio.idPregunta);
    // if( reg.length <= 0){
    //   $($(''+audio.selector).parent().get(0)).prepend('<div id="content-'+audio.idRegistro+'_'+audio.idPregunta+'"></div>')
    // }
    // $('#content-'+audio.idRegistro+'_'+audio.idPregunta).prepend(template);

    // $('.play.' + audio.id).on('click', () => { playPauseAudio(audio) })
    // $('.remove.' + audio.id).on('click', () => { removeAudio(audio) })

  }

  templateAudio( audio ){
    let date  = (new Date(audio.date).toISOString()).split('T');
    let time = date[1].split('.')[0];
    date = `${date[0]} ${time}`;
    return `<div class="MediaRecord-media ${audio.id} ${audio.idRegistro} ${audio.idPregunta}">
      <div class="MediaRecord-buttons-media">
        <button data-url="${audio.path}" class="play ${audio.id}">${this.icons.playIcon}</button>
        <input class="range ex1-${audio.id}" type="range" value="0" min="0" max="100"/>
        <button class="remove ${audio.id}" >${this.icons.deleteIcon}</button>
      </div>
      <div class="MediaRecord-date">${date}</div>
    </div>`
  }

  upload( data ) {
    let uri = encodeURI( this.arguments.nameServer );

    let options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = data.name;
    options.mimeType = "application/octet-stream";

    let headers = { 'name' : data.name };

    options.headers = headers;

    let ft = new FileTransfer();
    ft.onprogress = function(progressEvent) {
      if (progressEvent.lengthComputable) {
        console.log(progressEvent.loaded / progressEvent.total);
      } else {
        console.log('----');
      }
    };
    ft.upload(data.path, uri, e => console.log(e), e => console.log(e), options);
  }

}


if( jQuery ){
  (function( $ ){
     $.fn.recordMedia = function({ idRegistro, idPregunta, nameServer, max }) {
      let selector = this.selector;  
      let app = new App({ idRegistro, idPregunta, max, nameServer, selector });
      // let init = app.init.bind(app);
      app.init()
      // document.addEventListener('deviceready', init , false);
      return { element: this, app: app };
     }; 
  })( jQuery )
}


export default App;
