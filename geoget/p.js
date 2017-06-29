var fs = require('fs');
var en = fs.readFileSync('./list.en.json', 'utf8');
var fr = fs.readFileSync('./list.fr.json', 'utf8');
eval('en = '+en);
eval('fr = '+fr);


var bl = en.reduce( function( c, n, i ){
  
  var code = n.code;
  c[code]={code: code, name: { en: n.name, fr: (fr[i].Nom || fr[i].nom).trim()}};
  return c;
}, {} );


fs.writeFileSync('countries.json', JSON.stringify( bl ));


// var request = require('request');
// var provinces = {
//   AB: {
//     geogratis: 48,
//     en: 'Alberta',
//     fr: 'Alberta'
//   },
//   BC: {
//     geogratis: 59,
//     en: 'British Columbia',
//     fr: 'Columbie Britanique'
//   },
//   MB: {
//     geogratis:46,
//     en: 'Manitoba',
//     fr: 'Manitoba'
//   },
//   NB: {
//     geogratis:13,
//     en: 'New Brunswick',
//     fr: 'Nouveau Brunswick'
//   },
//   NL: {
//     geogratis:10,
//     en: 'Newfoundland',
//     fr: 'Terre-Neuve'
//   },
//   NS: {
//     geogratis:12,
//     en: 'Nova Scotia',
//     fr: 'Nouvelle Écosse'
//   },
//   NT: {
//     geogratis: 61,
//     en: 'Northwest Territories',
//     fr: 'Territoires du nord-ouest'
//   },
//   NU: {
//     geogratis: 62,
//     en: 'Nunavut',
//     fr: 'Nunavut'
//   },
//   ON: {
//     geogratis:35,
//     en: 'Ontario',
//     fr: 'Ontario'
//   },
//   PE: {
//     geogratis:11,
//     en: "Prince Edward Island",
//     fr: "Île-du-Prince-Édouard"
//   },
//   QC: {
//     geogratis:24,
//     en: 'Quebec',
//     fr: 'Québec'
//   },
//   SK: {
//     geogratis:47,
//     en: 'Saskatchewan',
//     fr: 'Saskatchewan'
//   },
//   YT: {
//     geogratis:60,
//     en: 'Yukon Territory',
//     fr: 'Territoire du Yukon'
//   }
// }



// Object.keys(provinces).reduce( function( key ){
//   var num = provinces[key].geogratis;
//   var en = provinces[key].en;
//   var fr = provinces[key].fr;
//   var code = key;
// });



