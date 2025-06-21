
        mapboxgl.accessToken = mapToken;

        
        const map = new mapboxgl.Map({
        container: 'map', 
        style: "mapbox://styles/mapbox/streets-v12",// container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 12,// starting zoom
    });

    

    const marker = new mapboxgl.Marker({color: '#e55e5e'})
        .setLngLat(listing.geometry.coordinates) // set the marker position [lng, lat]
        .setPopup(
            new mapboxgl.Popup({offset: 30})
        .setHTML(
            `<h4>${listing.location}</h4>
            <p>Exact location of your booking</p>`

        ))
        .addTo(map); // add the marker to the map