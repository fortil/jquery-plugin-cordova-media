class App {
  constructor ({ idRegistro, idPregunta, max, selector }){
    this.arguments = {
      selector,
      idRegistro,
      idPregunta,
      max
    };
    this.audios = {};
    this.cordovaDir = '';
    this.icons = {
      playIcon: this.getIcon('play_arrow'),
      pauseIcon: this.getIcon('pause'),
      deleteIcon: this.getIcon('clear')
    };
    this.mjs = {
      recording: 'Detener grabación',
      stoprecord: 'Grabar audio',
      mjsrecord: 'Grabando audio....'
    };
    this.record = { recording: false };
    
    if(localStorage.getItem('songs') != undefined && localStorage.getItem('songs') != '')
      this.songs = JSON.parse(localStorage.getItem('songs'));
    else
      this.songs = {}
  }

  getIcon(icon){
    return `<i class="material-icons md-18">${icon}</i>`; 
  }

  init(){
    let rec = this.recordAudio.bind(this);
    let agrs = this.arguments;
    this.cordovaDir = cordova.file.externalDataDirectory;
    let button = $(''+this.arguments.selector);
    button.after('<div id="mensaje" class="mensaje alignAbsoluteCenter">grabando ....</div>');
    button.click((evt)=>rec(agrs));
    this.mjs = {
      recording: ( button.data('recording') || this.mjs.recording ),
      stoprecord: ( button.data('stoprecord') || this.mjs.stoprecord ),
      mjsrecord: ( button.data('mjsrecord') || this.mjs.mjsrecord )
    }
  }

  reloadValues(){
    this.songs = JSON.parse(localStorage.getItem('songs'));
  }

  chargeValues(){
    localStorage.setItem('songs',JSON.stringify(this.songs));
  }

  changeIconView(id, icon){
    document.getElementsByClassName('play '+id)[0].innerHTML = icon;
  }

  playPauseAudio( { id, fullPath, name, selector, idRegistro, idPregunta, max } ){
    let playIcon = this.icons.playIcon;
    let pauseIcon = this.icons.pauseIcon;
    let changeIconView = this.changeIconView;

    if( this.audios[id] != undefined && this.audios[id].estado != 'pause'){
      this.audios[id].pause();
      this.audios[id].estado = 'pause';
      changeIconView(id, playIcon)
      clearInterval(this.audios[id].mediaTimer);
    }else{
      this.audios[id] = new Media(fullPath,
        ()=> {
          changeIconView(id, pauseIcon);
        },
        (err) => {
          changeIconView(id, playIcon);
        }
      );
      this.audios[id].play();
      this.audios[id].estado = 'play';
      changeIconView(id, pauseIcon);
    }
    let dur = Math.round( this.audios[id].getDuration() * 10 ) / 10;
    let element = document.getElementsByClassName('range ex1-'+id)[0];
    element.max = dur;
    element.value = 0;

    this.audios[id].mediaTimer = setInterval(()=>{

      this.audios[id].getCurrentPosition(
        position => {
          let pos = Math.round( position * 10 ) / 10;
          if(pos < 0 ){
            clearInterval(this.audios[id].mediaTimer)
            changeIconView(id, pauseIcon);
          }else
            element.value = pos;
        },
        e => {
          console.log("Error getting pos=" + e);
        }
      );
      
      if (dur == 0){
        clearInterval(this.audios[id].mediaTimer);
      }
    }, 500)

  }
  removeAudio( { id, fullPath, name, selector, idRegistro, idPregunta, max } ){
    let self = this
    window.resolveLocalFileSystemURL( self.cordovaDir, dir => {
      dir.getFile(name , { create: true }, file => {
        file.remove( file =>{
          delete self.songs[id];
          self.reloadValues.bind(self)();
          self.chargeValues.bind(self)();

          document.getElementById('content-'+idRegistro+'_'+idPregunta).remove();
          console.log("File removed!");
        }, () => {
          console.log("error deleting the file " + error.code);
        });
      });
    });
  }

  recordAudio({ selector, idRegistro, idPregunta, max }){
    let store = this.cordovaDir; //externalApplicationStorageDirectory; // window.externalApplicationStorageDirectory || window.PERSISTENT || window.TEMPORARY;
    let filepart = Date.now();
    let name =  filepart + '_' + idRegistro + '_' + idPregunta + '.amr';
    let fullPath = store + name;

    if( Object.keys(this.songs).length >= max ){
      alert(' Llegó al máximo de grabaciones posibles ')
    }else{
      if( this.record.recording == true ){
        this.record.media.stopRecord();
        this.record.recording = false;
        this.stopRecordView( selector );
      }else{
        let addAudio = this.addAudio.bind(this);
        this.record.recording = true;
        this.record.media = new Media( fullPath , 
          e => addAudio({ fullPath, name, selector, idRegistro, idPregunta, max }) , 
          e => console.log(e) );
        this.record.media.startRecord();
        this.startRecordView( selector );
      }
    }
  }

  addAudio({ fullPath, name, selector, idRegistro, idPregunta, max }){
    let id = Date.now();
    this.songs[id] = { id, fullPath, name, selector, idRegistro, idPregunta, max };
    this.chargeValues.bind(this)()
    this.addAudioView.bind(this)({ id, fullPath, name, selector, idRegistro, idPregunta, max })
  }

  startRecordView( selector ){
    document.querySelector( selector + '').innerHTML = this.mjs.recording;
    document.getElementById('mensaje').style.visibility = 'visible';
  }

  stopRecordView( selector ){
    document.querySelector( selector + '').innerHTML = this.mjs.stoprecord;
    document.getElementById('mensaje').style.visibility = 'hidden';
  }

  addAudioView( audio ){

    // var playList = document.createElement('div');
    //     playList.id = 'content-' + audio.id;
    // var father = document.querySelector( audio.selector ).parentElement;

    // var song = document.createElement('li');
    //     song.id = audio.id;
    //     song.innerHTML = this.templateAudio.bind(this)(audio);

    let playPauseAudio = this.playPauseAudio.bind(this);
    let removeAudio = this.removeAudio.bind(this);

    // playList.insertBefore(song, playList.nextSibling);//.appendChild( song );
    // father.insertBefore(playList, father.nextSibling); //.appendChild( playList );
    // document.getElementsByClassName('play ' + audio.id)[0]
    //   .addEventListener('click', () => playPauseAudio(audio), false);
    
    // document.getElementsByClassName('remove ' + audio.id)[0]
    //   .addEventListener('click', () => removeAudio(audio), false);
    
    let reg = $('div#content-'+audio.idRegistro+'-'+audio.idPregunta);
    let template = this.templateAudio.bind(this)(audio);
    if( reg.length <= 0){
      $($(''+audio.selector).parent().get(0)).prepend('<div class="media" id="content-'+audio.idRegistro+'_'+audio.idPregunta+'"></div>')
    }

    $('#content-'+audio.idRegistro+'_'+audio.idPregunta).prepend(template);
    $('.play.' + audio.id).click(()=>{ playPauseAudio(audio) })
    $('.remove.' + audio.id).click(()=>{ removeAudio(audio) })

  }

  templateAudio( audio ){
    return `<div data-url="${audio.fullPath}" class="play ${audio.id}">${this.icons.playIcon}</div><input class="range ex1-${audio.id}" type="range" value="0" min="0" max="100"/><div class="remove ${audio.id}" data-url="${audio.fullPath}">${this.icons.deleteIcon}</div>`
  }

}

// let url = "http://192.168.4.88/upload/upload.php";
// let idBtnRecord = 'recordSong';
// let idMensaje = 'mensaje';

// let app = new App({ url, idMensaje, idBtnRecord })


(function( $ ){
   $.fn.recordMedia = function({ idRegistro, idPregunta, max }) {
    let selector = this.selector;  
    let app = new App({ idRegistro, idPregunta, max, selector });
    let init = app.init.bind(app);
    document.addEventListener('deviceready', init , false);
    return { element: this, app: app };
   }; 
})( jQuery )

