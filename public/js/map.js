
        mapboxgl.accessToken = mapToken;

        
        const map = new mapboxgl.Map({
        container: 'map', 
        style: "mapbox://styles/mapbox/streets-v12",// container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10,// starting zoom
    });

    const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false}).setMaxWidth("300px").setHTML(
        `<strong>${listing.location}, ${listing.country}</strong><p>Exact location provided after booking!</p>`
    );

    const marker = new mapboxgl.Marker({color: '#e55e5e'})
        .setLngLat(listing.geometry.coordinates) // set the marker position [lng, lat]
        .addTo(map); // add the marker to the map

    marker.getElement().addEventListener("mouseenter", () => {
        map.getCanvas().style.cursor = "pointer";
        marker.setPopup(popup).togglePopup(); // Show the popup on hover
    });



    marker.getElement().addEventListener("mouseleave", () => {
        map.getCanvas().style.cursor = "";
        marker.togglePopup(); // Hide the popup when not hovering
    });



