jQuery plugin - media cordova
===================

Wonderfull plugin to record and play media using cordova and jQuery. This plugin generate a complete view to use it in a **mobile app**. It's easy to use,  you only have to follow the recommendations. This plugin use WebSQL to save the created files.
Requirements
-------

>- Install cordova ([go to documentation](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html))

>- Need jQuery

How to use
-------
### index.html
- Call  the files you need before the plugin

```
<div class="primero alignAbsoluteCenterV">
   <button type="button" id="recordSong"  data-recording="hellow recording" data-stoprecord="To recording" class="recordSong">Record audio</button>
</div>
<div class="otro alignAbsoluteCenterV">
    <button type="button" id="recordSong2" class="recordSong">Record audio2</button>
</div>
:
:
  <script src="./js/libs/jquery.min.js"></script>
  <script src="./cordova.js"></script>
  <script src="./js/libs/jquery-cordova-plugin-record-media.js"></script>
  <script src="./js/custom_js.js"></script>
</body>
```
You can add <kbd>data</kbd> attributes to element to custom the outs [view](#data_attributes)
### JS file custom (custom_js.js)
First, you call to cordova event <kbd>deviceready</kbd>.
The Plugin receive 3 parameters, the two first are **IDs** for the records and the last is for the record limit.
```
document.addEventListener('deviceready', function(){

  $('#recordSong').recordMedia({ 
    'idRegistro': '52154',
    'idPregunta': '441121', 
    'max': 5 
  });

  $('#recordSong2').recordMedia({ 
    'idRegistro': '52154',
    'idPregunta': 'cual', 
    'max': 5 
  });

}, false);
```
Data attributes
-----
- **recording**: It's when the plugin is recording.
- **stoprecord**: It's when the plugin is stopped or it isn't working.
- **mjsrecord**: It's the message when you start to record.
- **alertmaxrecord**: Alert message when you achieve the max records.
- **dialogconfirm**: Confirm message, when you delete a file.
- **fields**: Fields of database table, for default are 'id,name,path,idRegistro,idPregunta,type,duration,date'.
- **tablename**:  Name of table, default is 'RECORDS'.
- **playIcon**: Play icon, default play icon of materialicons.
- **stopIcon**: Stop icon, default stop icon of materialicons.
- **deleteIcon**: Delete icon, default delete icon of materialicons.

### Styles
You can use styles based in the classes that the plugin generates to give it custom styles.
