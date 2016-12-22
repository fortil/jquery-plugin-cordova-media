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

class SQLRecords{
  /*
  @params 
  name: Nombre de la tabla
  description: descripción de la tabla
  size: tamaño de la tabla
  table: un objeto con los siguientes items
    name: nombre de la tabla
    fields: los campos que tendrá la tabla
  */
  constructor({name, description, size, table, app}){
    this.db = window.openDatabase(name,'1.0.0',description,size);
    this.table = table;
    this.fields = '';
    this.app = app;
    for (var i = 0; i < this.table.fields.length; i++) {
      this.fields += (i==0 ? this.table.fields[i] : ', '+this.table.fields[i]);
    }
    this.db.transaction( tx => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS ${this.table.name} (${this.fields})`);
    })
  }
  insertValue( records ){
    this.db.transaction( tx => {
      let values = "";
      for (var i = 0; i < records.length; i++) {
        values += (i==0 ? "?" : ", ?");
      }
      tx.executeSql(`INSERT INTO ${this.table.name} (${this.fields}) VALUES (${values})`,records);
    })
  }
  deleteValue( {field, value}, cb ){
    this.db.transaction( tx => tx.executeSql(`DELETE FROM ${this.table.name} WHERE ${field} = ?`, [value], e => cb('ok'), e => cb('error')) );
  }
  getAllValues(cb){
    let values = {};
    this.db.transaction( tx => {
      tx.executeSql(`SELECT * FROM ${this.table.name} WHERE idRegistro = ? AND idPregunta = ?`, 
        [ this.app.idRegistro, this.app.idPregunta ], (tx, results) => {
        if(results.rows.length == 0)
          values = {}
        else
          values = results.rows;

        if(cb)
          cb(values)
        else
          return values
      }, null);
    })
  }
  getAllValuesAsId( cb ){
    this.getAllValues( rows => {
      let keys = Object.keys(rows);
      let values = {};
      if( keys.length > 0){
        for (var i = 0; i < keys.length; i++) {
          values[rows[keys[i]].id] = rows[keys[i]];
        }
      }
      if(cb)
        cb(values);
      else
        return values;
    })
  }
  getValuesById( id, cb ){
    this.getValues({ field: 'id', value: id}, cb);
  }
  getValues( {field, value}, cb ){
    let val = {};
    this.db.transaction( tx => {
      tx.executeSql(`SELECT * FROM ${this.table.name} WHERE ${field} = ? AND idRegistro = ? AND idPregunta = ?`, 
        [value, this.app.idRegistro, this.app.idPregunta], function (tx, results) {
        if(results.rows.length == 0)
          val = {};
        else
          val = results.rows;
        if(cb)
          cb(val);
        else
          return val;
      }, null);
    })
  }
  updateValue( {field, value, fieldWhere, valueWhere}, cb ){
    let res = 'error';
    this.db.transaction( tx => {
      tx.executeSql(`UPDATE ${this.table.name} SET ${field} = ? WHERE ${fieldWhere} = ?`, [value, valueWhere], e => res = 'ok', e => res = 'error' );
      if(cb)
        cb(res);
      else
        return res;
    })
  }
  updateValueById( {field, value, id } ){
    this.updateValue( {field, value, fieldWhere: 'id', valueWhere: id}, res => {
      return res
    } )
  }
}

class App {
  constructor ({ idRegistro, idPregunta, max, selector }){
    this.arguments = {
      selector,
      idRegistro,
      idPregunta,
      max
    };
    this.audio = {};
    this.DB;
    this.cordovaDir = '';
    // Default Icons
    this.icons = {
      playIcon: this.getIcon('play_arrow'),
      stopIcon: this.getIcon('stop'),
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
    $('#content-'+this.arguments.idRegistro+'_'+this.arguments.idPregunta).empty();
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
    $('.play.'+id).html(icon);
  }

  playPauseAudio( { id, path, name, selector, idRegistro, idPregunta, max } ){
    let playIcon = this.icons.playIcon;
    let stopIcon = this.icons.stopIcon;
    let changeIconView = this.changeIconView;
    let element = document.getElementsByClassName('range ex1-'+id)[0];
    let dur = 100;
    let stopState = stopStateFunc.bind(this);
    let playState = playStateFunc.bind(this);
    let mediaTimer = ()=>{}

    if( this.audio && this.audio.id == id && this.audio.estado != 'pause'){
      stopState()
    }else if( this.audio && this.audio.id == id && this.audio.estado == 'pause' ){
      playState();
    }else{
      this.audio = {};
      this.audio.media = new Media( path,
        e => { console.log('Success ',e); changeIconView(id, stopIcon); },
        err => { changeIconView(id, playIcon); },
        e => { console.log('Status ', e); if(e==4) stopState(); }
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
        dur = (Math.round( this.audio.media.getDuration() * 10 ) / 10) * 100 ;
        dur = dur <= 0 ? (-1*dur) : dur;
        element.max = dur;

        this.audio.media.getCurrentPosition(
          position => {
            let pos = (Math.round( position * 10 ) / 10) * 100;
            if(pos <= 0 || this.audio.estado == 'pause' ){
              stopState()
              this.DB.updateValueById( {field:'duration' , value: dur/100, id } );
            }else
              element.value = pos;
          },
          e => {
            console.log("Error getting pos=" + e);
          }
        );
        
        if (dur == 0 || this.audio.estado == 'pause' ){
          stopState();//{audio: this.audio, element })
          this.DB.updateValueById( {field:'duration' , value: dur/100, id } );
        }
      }, 500)
    }

    function stopStateFunc(){
      this.audio.estado = 'pause';
      this.audio.media.pause();
      clearInterval(mediaTimer);
      element.value = 0;
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
                // $('#content-'+idRegistro+'_'+idPregunta).remove();
                this.initView();
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
    let name =  id + '_' + idRegistro + '_' + idPregunta + '.amr';
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
          this.record.recording = true;
          this.record.media = new Media( path , 
            e => addAudio({ id, path, name, selector, idRegistro, idPregunta, max }) , 
            e => console.log(e) );
          this.record.media.startRecord();
          this.startRecordView.bind(this)( selector );
        }
      }
      
    } );

  }

  addAudio({ id, path, name, selector, idRegistro, idPregunta, max }){
    // ['id', 'name', 'path', 'idRegistro', 'idPregunta', 'type', 'duration', 'date']
    this.DB.insertValue( [id, name, path, idRegistro, idPregunta, 'audio', '4.0', new Date().getTime()] ); 
    this.addAudioView.bind(this)({ id, path, name, selector, idRegistro, idPregunta, max })
  }

  startRecordView( selector ){
    document.querySelector( selector + '').innerHTML = this.strings.recording;
    $('.mensaje.'+this.arguments.idRegistro+'.'+this.arguments.idPregunta).css('visibility','visible')
  }

  stopRecordView( selector ){
    document.querySelector( selector + '').innerHTML = this.strings.stoprecord;
    $('.mensaje.'+this.arguments.idRegistro+'.'+this.arguments.idPregunta).css('visibility','hidden');
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
    
    let reg = $('div#content-'+audio.idRegistro+'_'+audio.idPregunta);
    let template = this.templateAudio.bind(this)(audio);
    if( reg.length <= 0){
      $($(''+audio.selector).parent().get(0)).prepend('<div id="content-'+audio.idRegistro+'_'+audio.idPregunta+'"></div>')
    }

    $('#content-'+audio.idRegistro+'_'+audio.idPregunta).prepend(template);
    $('.play.' + audio.id).on('click', () => { playPauseAudio(audio) })
    $('.remove.' + audio.id).on('click', () => { removeAudio(audio) })

  }

  templateAudio( audio ){
    return `<div class="MediaRecord-media">
      <div class="MediaRecord-buttons-media">
        <button data-url="${audio.path}" class="play ${audio.id}">${this.icons.playIcon}</button><input class="range ex1-${audio.id}" type="range" value="0" min="0" max="100"/><button class="remove ${audio.id}" data-url="${audio.path}">${this.icons.deleteIcon}</button>
      </div>
    </div>`
  }

}


(function( $ ){
   $.fn.recordMedia = function({ idRegistro, idPregunta, max }) {
    let selector = this.selector;  
    let app = new App({ idRegistro, idPregunta, max, selector });
    // let init = app.init.bind(app);
    app.init()
    // document.addEventListener('deviceready', init , false);
    return { element: this, app: app };
   }; 
})( jQuery )

