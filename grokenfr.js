var string = "<p>{:en}A modern classic revisited. Clean lines an& travail quau salon. À vos combinaisons!{:}</p>"

var removeAutoP = function( s ){
  return s.trim().replace(/^\<p\>/,'').replace(/\<\/p\>$/, '');
}

var grepLang = function(s,l){
 var start = s.indexOf('{:'+l+'}');
 var remainder = s.slice(start+5);
 var end = remainder.indexOf('{:}');
 remainder = remainder.slice(0,end);
 return remainder;
}

var renderAsString( text, lang ){
 if(!text) return '';
 if(typeof text == 'string'){
   var en = grepLang(text,'en');
   var fr = grepLang(text,'fr')||en;
   return lang == 'fr' ? fr||en : en||fr;
 }else if(text.en || text.fr){
   return lang == 'fr' ? text.fr||text.en : text.en||text.fr;
 }else if(text.rendered){
   return renderAsString( text.rendered, lang );
 }
 return text;
}
