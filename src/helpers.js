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
    this.db = window.openDatabase(name,'1.0.0', (description || 'Default description'), (size || 64 * 1024 ));
    this.table = table;
    this.fields = '';
    this.app = app || { idRegistro: MakeId(), idPregunta: MakeId() };
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
        cb(values)
      else
        return values
    })
  }

  getValuesById( id, cb ){
    this.getValues({ field: 'id', value: id}, cb)
  }
  getValues( {field, value}, cb ){
    let val = {};
    this.db.transaction( tx => {
      tx.executeSql(`SELECT * FROM ${this.table.name} WHERE ${field} = ? AND idRegistro = ? AND idPregunta = ?`, 
        [value, this.app.idRegistro, this.app.idPregunta], function (tx, results) {
        if(results.rows.length == 0)
          val = {}
        else
          val = results.rows;
        if(cb)
          cb(val)
        else
          return val
      }, null);
    })
  }
  updateValue( {field, value, fieldWhere, valueWhere}, cb ){
    let res = 'error';
    this.db.transaction( tx => {
      tx.executeSql(`UPDATE ${this.table.name} SET ${field} = ? WHERE ${fieldWhere} = ?`, [value, valueWhere], e => res = 'ok', e => res = 'error' );
      if(cb)
        cb(res)
      else
        return res
    })
  }
  updateValueById( {field, value, id } ){
    this.updateValue( {field, value, fieldWhere: 'id', valueWhere: id}, res => {
      return res
    } )
  }
  
}
function MakeId(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
window.Helper = { SQLRecords, MakeId }
export { SQLRecords, MakeId };