(function(EDB){
  if(!EDB) throw new Error('Missing EDB namespace.');
  
  EDB.createResourceReference({
    api: 'wc',
    name: 'product',
    path: 'products',
    convert: [{
      read: 'name', write: 'name'
    }, {
      read: 'description',
      write: 'description',
      process: EDB.processors.translate
    }, {
      read: 'attributes',
      write: 'attributes'
    },{
        read: 'meta_box',
        write: 'meta'
      },{
        read: 'images',
        write: 'images'
      },{
        read: 'date_created',
        write: 'created',
        process: function( v ){ return new Date(v ); }
    
      }, {
      read: 'images.0.id',
      write: 'image.id'
    }, {
      read: 'images.0.src',
      write: 'image.src'
    },
    , {
      read: 'variations',
      write: 'variations'
    },
    {
      read: 'categories',
      write: 'categories'
    }]
  });
  
  
  EDB.createResourceReference({
    api: 'wp',
    name: 'slide',
    path:'slides',
    convert: [
      { read: 'id', write:'id'},
      { read: 'featured_image', write:'image.src'},
      { read: 'featured_media', write:'image.id'},
      { read: 'title.rendered', write:'title', process: EDB.processors.translate },
      { read: 'content.rendered', write:'subtitle', process: EDB.processors.translate },
      { read: 'meta_box.edb_slide_url', write:'slideUrl'},
      { read: 'meta_box.edb_sort_order', write:'sortOrder'},
    ]
  });
  
   
  
  EDB.createResourceReference({
    api: 'wp',
    name: 'feature',
    path:'features',
    convert: [
      { read: 'id', write:'id'},
      { read: 'featured_image', write:'image.src'},
      { read: 'featured_media', write:'image.id'},
      { read: 'title.rendered', write:'title', process: EDB.processors.translate },
      { read: 'excerpt.rendered', write:'subtitle', process: EDB.processors.translate },
      { read: 'content.rendered', write:'content', process: EDB.processors.translate },
      { read: 'meta_box.edb_feature_url', write:'featureUrl'},
      { read: 'meta_box.edb_sort_order', write:'sortOrder' },
      { read: 'meta_box.edb_card_type', write:'cardType' },
    ]
  })
  
  
  EDB.createResourceReference({
    api: 'wp',
    name: 'inspiration',
    path:'inspirations',
    convert: [
      { read: 'id', write:'id'},
      { read: 'featured_image', write:'image.src'},
      { read: 'featured_media', write:'image.id'},
      { read: 'title.rendered', write:'title', process: EDB.processors.translate },
      { read: 'excerpt.rendered', write:'subtitle', process: EDB.processors.translate },
      { read: 'content.rendered', write:'content', process: EDB.processors.translate },
      { read: 'meta_box.edb_inspiration_images', write: 'images', process: function( image ){ return {id: image.ID, src: image.full_url }} },
      { read: 'meta_box.edb_sort_order', write:'sortOrder' },
    ]
  });
  
  
 
  

  
})(window.EDB);