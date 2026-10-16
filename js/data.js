window.OB = window.OB || {};

OB.img = (name) => `assets/img/${name}.jpg`;

OB.user = {
  first: 'Adaeze', last: 'Mensah', email: 'adaeze.mensah@gmail.com', phone: '+234 803 456 7890',
  dob: '1992-04-14', nationality: 'Nigerian', residence: 'Nigeria', gender: 'Female',
  passport: { number: 'A09345821', country: 'Nigeria', issued: '2022-03-14', expiry: '2032-03-13' }
};

OB.travellers = [
  { id: 't1', name: 'Kwame Mensah', type: 'Adult', dob: '07 May 1989', nationality: 'Ghanaian', passport: 'G3184027', expiry: '22 Aug 2029' },
  { id: 't2', name: 'Zuri Mensah', type: 'Child', dob: '12 Feb 2017', nationality: 'Nigerian', passport: 'A10856322', expiry: '09 Nov 2028' }
];

OB.events = [
  { id: 'afrobeats-live', title: 'Afrobeats Live: Lagos Christmas Edition', img: 'event-afrobeats-live', date: 'Sat, 19 Dec', time: '8:00 PM', venue: 'Eko Convention Centre, Victoria Island', city: 'Lagos', price: 45000, category: 'Concerts', tag: 'Selling fast' },
  { id: 'isimi-lagos', title: 'Isimi Lagos Festival 2026', img: 'event-isimi-lagos', date: 'Sat, 31 Oct', time: '12:00 PM', venue: 'Federal Palace Hotel, Victoria Island', city: 'Lagos', price: 25000, category: 'Festivals' },
  { id: 'moremi', title: 'Moremi: The Musical', img: 'event-terra-kulture', date: 'Sun, 8 Nov', time: '4:00 PM', venue: 'Terra Kulture Arena, Victoria Island', city: 'Lagos', price: 20000, category: 'Theatre' },
  { id: 'jokes-on-you', title: "The Joke's On You: Comedy Night", img: 'event-comedy', date: 'Fri, 20 Nov', time: '7:30 PM', venue: 'The VL, Lekki Phase 1', city: 'Lagos', price: 15000, category: 'Comedy' },
  { id: 'private-dinner', title: 'Private Dinner with Chef Smokey Pan', img: 'event-private-dinner', date: 'Sat, 14 Nov', time: '7:00 PM', venue: 'Secret location, Ikoyi', city: 'Lagos', price: 190000, category: 'Food & drink', tag: '12 seats left' },
  { id: 'rooftop-sessions', title: 'Detty December Rooftop Sessions', img: 'event-dj-party', date: 'Sat, 26 Dec', time: '6:00 PM', venue: 'Landmark Beach Rooftop, Oniru', city: 'Lagos', price: 30000, category: 'Parties' },
  { id: 'soul-strings', title: 'Soul & Strings Night', img: 'event-soul-night', date: 'Sat, 21 Nov', time: '8:00 PM', venue: 'MUSON Centre, Onikan', city: 'Lagos', price: 35000, category: 'Concerts' },
  { id: 'sol-beach', title: 'Season Opening Party at Sol Beach', img: 'event-beach-opening-party', date: 'Sun, 6 Dec', time: '4:00 PM', venue: 'Sol Beach, Elegushi', city: 'Lagos', price: 20000, category: 'Parties' },
  { id: 'gidi-block-party', title: 'Gidi Block Party', img: 'event-crowd', date: 'Sun, 27 Dec', time: '2:00 PM', venue: 'Muri Okunola Park, Victoria Island', city: 'Lagos', price: 10000, category: 'Parties' },
  { id: 'blessed-lounge', title: 'Blessed Lounge Day Rave', img: 'event-blessed-lounge', date: 'Sat, 12 Dec', time: '7:00 PM', venue: 'Blessed Lounge, Otefe-Oghara', city: 'Delta', price: 2000, category: 'Parties' },
  { id: 'dj-sessions', title: 'Vinyl & Vibes: DJ Sessions', img: 'event-dj-portrait', date: 'Fri, 4 Dec', time: '9:00 PM', venue: 'Hard Rock Cafe, Victoria Island', city: 'Lagos', price: 12000, category: 'Parties' }
];

OB.ticketTiers = [
  { id: 'regular', name: 'Regular', note: 'General admission. Standing area.', price: 45000 },
  { id: 'vip', name: 'VIP', note: 'Seated section, fast-track entry and a welcome drink.', price: 120000 },
  { id: 'table', name: 'VVIP table for 6', note: 'Private table near the stage with bottle service.', price: 900000 },
  { id: 'early', name: 'Early bird', note: 'Released 1 October.', price: 30000, soldOut: true }
];

OB.flightDeals = [
  { id: 'los-lhr', from: 'Lagos', to: 'London', code: 'LHR', img: 'dest-london', duration: '6h 30m', stops: 'Direct', cabin: 'Economy', price: 1250000 },
  { id: 'los-dxb', from: 'Lagos', to: 'Dubai', code: 'DXB', img: 'dest-dubai', duration: '7h 40m', stops: 'Direct', cabin: 'Economy', price: 890000 },
  { id: 'los-acc', from: 'Lagos', to: 'Accra', code: 'ACC', img: 'dest-accra', duration: '1h 10m', stops: 'Direct', cabin: 'Economy', price: 265000 },
  { id: 'los-mle', from: 'Lagos', to: 'Malé', code: 'MLE', img: 'dest-maldives', duration: '16h 40m', stops: '1 stop', cabin: 'Economy', price: 1640000 },
  { id: 'los-yyz', from: 'Lagos', to: 'Toronto', code: 'YYZ', img: 'travel-autumn-park', duration: '17h 20m', stops: '1 stop', cabin: 'Economy', price: 1980000 },
  { id: 'los-fco', from: 'Lagos', to: 'Rome', code: 'FCO', img: 'dest-rome', duration: '9h 55m', stops: '1 stop', cabin: 'Economy', price: 1120000 }
];

OB.experiences = [
  { id: 'egypt-nile', title: '6-Day Egypt Highlights & Nile Cruise', img: 'egypt-pyramid', by: 'Nice Tours', place: 'Cairo & Luxor, Egypt', price: 3190000, unit: 'person', rating: 4.8, reviews: 32, tag: 'Top rated' },
  { id: 'maldives-escape', title: '5 Nights Overwater Escape in the Maldives', img: 'cat-experiences', by: 'YellowLyfe Tours', place: 'North Malé Atoll, Maldives', price: 4850000, unit: 'person', rating: 4.9, reviews: 18 },
  { id: 'accra-weekend', title: 'Accra Weekend: Culture & Food Trail', img: 'dest-accra', by: 'Kente Trails', place: 'Accra, Ghana', price: 620000, unit: 'person', rating: 4.7, reviews: 54 },
  { id: 'erin-ijesha', title: 'Erin-Ijesha Waterfalls Day Trip', img: 'exp-waterfall', by: 'Naija Hikers', place: 'Osun State', price: 45000, unit: 'person', rating: 4.6, reviews: 121 },
  { id: 'floating-breakfast', title: 'Floating Breakfast & Spa Day', img: 'exp-floating-breakfast', by: 'The Lagoon Suites', place: 'Lekki, Lagos', price: 85000, unit: 'person', rating: 4.8, reviews: 76 },
  { id: 'beach-retreat', title: 'Weekend Beach Retreat at La Campagne', img: 'exp-beach-retreat', by: 'Getaway Africa', place: 'Ibeju-Lekki, Lagos', price: 210000, unit: 'person', rating: 4.5, reviews: 63 },
  { id: 'highlife-night', title: 'Highlife & Jazz Night at Freedom Park', img: 'exp-highlife-band', by: 'Freedom Park Lagos', place: 'Lagos Island', price: 12000, unit: 'person', rating: 4.7, reviews: 210 },
  { id: 'abuja-tour', title: 'Abuja City & Culture Tour', img: 'dest-abuja', by: 'Capital Walks', place: 'Abuja, FCT', price: 38000, unit: 'person', rating: 4.4, reviews: 39 },
  { id: 'dubai-desert', title: 'Dubai Desert Safari & Quad Biking', img: 'like-quad', by: 'Desert Wheels', place: 'Dubai, UAE', price: 210000, unit: 'person', rating: 4.8, reviews: 412 },
  { id: 'luxor-balloon', title: 'Sunrise Hot Air Balloon over Luxor', img: 'egypt-balloon', by: 'Nice Tours', place: 'Luxor, Egypt', price: 340000, unit: 'person', rating: 4.9, reviews: 88 },
  { id: 'palm-skydive', title: 'Tandem Skydive over Palm Jumeirah', img: 'like-skydive', by: 'Sky Dubai', place: 'Dubai, UAE', price: 1150000, unit: 'person', rating: 5.0, reviews: 64 },
  { id: 'afternoon-tea', title: 'Afternoon Tea for Two at The Wheatbaker', img: 'like-dining', by: 'The Wheatbaker', place: 'Ikoyi, Lagos', price: 55000, unit: 'pair', rating: 4.6, reviews: 47 },
  { id: 'giza-camels', title: 'Sunset Camel Trek at Giza', img: 'like-camels', by: 'Nice Tours', place: 'Giza, Egypt', price: 95000, unit: 'person', rating: 4.7, reviews: 156 }
];

OB.dining = [
  { id: 'saffron', title: 'Saffron Rooftop Lounge', img: 'dine-cocktail', kind: 'Lounge', place: 'Ikoyi, Lagos', price: 25000 },
  { id: 'ember', title: 'Ember Grill House', img: 'dine-plated', kind: 'Restaurant', place: 'Victoria Island, Lagos', price: 35000 },
  { id: 'itan', title: 'Ìtàn Kitchen', img: 'dine-platter', kind: 'Restaurant', place: 'Lekki Phase 1, Lagos', price: 30000 },
  { id: 'forno', title: 'Forno 22 Pizzeria', img: 'dine-pizza', kind: 'Casual dining', place: 'Lekki, Lagos', price: 15000 }
];

OB.hotels = [
  { id: 'coral-bay', title: 'Coral Bay Overwater Villas', img: 'dest-maldives', place: 'North Malé Atoll, Maldives', price: 685000, rating: 4.9, reviews: 312, note: 'Breakfast included' },
  { id: 'lagoon-huts', title: 'Lagoon Huts Resort', img: 'cat-experiences', place: 'Baa Atoll, Maldives', price: 540000, rating: 4.7, reviews: 188, note: 'Free airport transfer' },
  { id: 'lagoon-suites', title: 'The Lagoon Pool Suites', img: 'exp-floating-breakfast', place: 'Lekki, Lagos', price: 145000, rating: 4.6, reviews: 241, note: 'Pay at hotel' },
  { id: 'palm-sands', title: 'Palm Sands Beach Resort', img: 'exp-beach-retreat', place: 'Eleko, Lagos', price: 98000, rating: 4.4, reviews: 97, note: 'Free cancellation' },
  { id: 'aegean-blue', title: 'Aegean Blue Boutique Hotel', img: 'dest-santorini', place: 'Oia, Santorini', price: 410000, rating: 4.8, reviews: 506, note: 'Breakfast included' },
  { id: 'trastevere', title: 'Casa Trastevere', img: 'dest-rome', place: 'Trastevere, Rome', price: 265000, rating: 4.5, reviews: 734, note: 'Free cancellation' }
];

OB.movies = [
  { id: 'hail-mary', title: 'Project Hail Mary', img: 'movie-hail-mary', genre: 'Sci-fi · Adventure', rating: 'PG-13', runtime: '2h 36m', tag: 'IMAX' },
  { id: 'third-mainland', title: 'Third Mainland', genre: 'Thriller', rating: '18', runtime: '1h 58m', art: ['#0B1F3A', '#F58220'], tagline: 'Nobody crosses at midnight', tag: 'New' },
  { id: 'owambe-diaries', title: 'Owambe Diaries', genre: 'Comedy · Romance', rating: '12A', runtime: '1h 47m', art: ['#7A1E5C', '#FFC857'], tagline: 'Every party has a secret' },
  { id: 'harmattan', title: 'Harmattan', genre: 'Drama', rating: '15', runtime: '2h 12m', art: ['#5B3A1A', '#E9C46A'], tagline: 'The dust remembers' },
  { id: 'last-danfo', title: 'The Last Danfo', genre: 'Action · Comedy', rating: '12A', runtime: '1h 52m', art: ['#F2C14E', '#101828'], tagline: 'Oshodi to Obalende. No stops.', dark: true },
  { id: 'oguns-daughter', title: "Ògún's Daughter", genre: 'Fantasy · Action', rating: '15', runtime: '2h 20m', art: ['#2B0F0F', '#C0392B'], tagline: 'Forged in iron', tag: 'IMAX' },
  { id: 'lagos-noir', title: 'Lagos Noir', genre: 'Crime', rating: '18', runtime: '2h 03m', art: ['#111111', '#2C90FF'], tagline: 'The city never sleeps' },
  { id: 'aso-ebi', title: 'Aso Ebi', genre: 'Family · Comedy', rating: 'PG', runtime: '1h 41m', art: ['#0E6E55', '#F6F9FF'], tagline: 'Same fabric. Different drama.' }
];

OB.cinemaChains = [
  { id: 'filmhouse', name: 'Filmhouse Cinemas', branches: ['Filmhouse IMAX Lekki', 'Filmhouse Surulere', 'Filmhouse Landmark VI'] },
  { id: 'genesis', name: 'Genesis Cinemas', branches: ['Genesis Maryland Mall', 'Genesis Lekki', 'Genesis Port Harcourt'] },
  { id: 'ebonylife', name: 'EbonyLife Cinemas', branches: ['EbonyLife Victoria Island'] },
  { id: 'viva', name: 'Viva Cinemas', branches: ['Viva Ikeja', 'Viva Ibadan', 'Viva Enugu'] }
];

OB.cinemas = [
  { id: 'filmhouse-lekki', name: 'Filmhouse IMAX Lekki', area: 'Lekki Phase 1', times: [['11:30', 'IMAX'], ['14:45', 'IMAX'], ['18:00', 'IMAX'], ['21:15', 'IMAX']], price: 9500 },
  { id: 'genesis-maryland', name: 'Genesis Cinemas Maryland Mall', area: 'Maryland', times: [['12:10', '2D'], ['15:20', '2D'], ['19:40', '2D']], price: 6000 },
  { id: 'ebonylife', name: 'EbonyLife Cinemas', area: 'Victoria Island', times: [['13:00', '2D'], ['16:30', '2D'], ['20:00', 'Premium']], price: 7500 }
];

OB.airlines = {
  QR: { name: 'Qatar Airways', color: '#5C0632' },
  ET: { name: 'Ethiopian', color: '#1B8A3E' },
  KQ: { name: 'Kenya Airways', color: '#B71C1C' },
  AF: { name: 'Air France', color: '#002157' }
};

OB.airlineOrder = ['QR', 'ET', 'KQ', 'AF'];

// Airlines with a logo file in assets/airlines/<CODE>.png. Add a code here after dropping in its logo.
OB.airlineLogoFiles = new Set(['QR', 'ET', 'KQ', 'AF']);

// Fare matrix columns: cheapest fare by stops [non-stop, 1 stop, 2+ stops]. Airlines repeat for different routings.
OB.fareMatrix = [
  { al: 'QR', via: 'via Doha', fares: [null, 1298000, 1214600] },
  { al: 'ET', via: 'via Addis Ababa', fares: [null, 1036200, 998400] },
  { al: 'KQ', via: 'via Nairobi', fares: [null, 1098900, 1052300] },
  { al: 'AF', via: 'via Paris', fares: [null, 1356800, 1189700] },
  { al: 'QR', via: 'Direct', fares: [1184500, 1201300, null] },
  { al: 'ET', via: 'via Lomé', fares: [null, 1142700, 1088200] },
  { al: 'KQ', via: 'via Accra', fares: [null, 1061400, 1019900] }
];

OB.flights = [
  { id: 'f1', al: 'QR', no: 'QR 1430', cabin: 'Economy', fare: 'Saver', refundable: false, price: 1184500, bag: '2 × 23kg',
    out: { dep: '14:35', arr: '00:15', plus: 1, from: 'LOS', to: 'DXB', dur: '7h 40m', stops: 0 },
    ret: { dep: '09:50', arr: '13:45', plus: 0, from: 'DXB', to: 'LOS', dur: '8h 55m', stops: 0 }, tags: [] },
  { id: 'f4', al: 'ET', no: 'ET 911', cabin: 'Economy', fare: 'Saver', refundable: false, price: 1142700, bag: '1 × 23kg',
    out: { dep: '06:35', arr: '23:55', plus: 0, from: 'LOS', to: 'DXB', dur: '15h 20m', stops: 1, via: 'ADD' },
    ret: { dep: '05:15', arr: '17:30', plus: 0, from: 'DXB', to: 'LOS', dur: '15h 15m', stops: 1, via: 'ADD' }, tags: [] },
  { id: 'f6', al: 'KQ', no: 'KQ 537', cabin: 'Economy', fare: 'Basic', refundable: false, price: 1061400, bag: '2 × 23kg',
    out: { dep: '13:45', arr: '02:55', plus: 1, from: 'LOS', to: 'DXB', dur: '11h 10m', stops: 1, via: 'NBO' },
    ret: { dep: '04:30', arr: '13:40', plus: 0, from: 'DXB', to: 'LOS', dur: '12h 10m', stops: 1, via: 'NBO' }, tags: [] },
  { id: 'f2', al: 'ET', no: 'ET 900', cabin: 'Economy', fare: 'Classic', refundable: true, price: 1036200, bag: '2 × 23kg',
    out: { dep: '11:25', arr: '05:10', plus: 1, from: 'LOS', to: 'DXB', dur: '14h 45m', stops: 1, via: 'ADD' },
    ret: { dep: '03:40', arr: '13:25', plus: 0, from: 'DXB', to: 'LOS', dur: '12h 45m', stops: 1, via: 'ADD' }, tags: ['Cheapest'] },
  { id: 'f3', al: 'QR', no: 'QR 1406', cabin: 'Economy', fare: 'Comfort', refundable: true, price: 1298000, bag: '2 × 23kg',
    out: { dep: '22:10', arr: '13:05', plus: 1, from: 'LOS', to: 'DXB', dur: '12h 55m', stops: 1, via: 'DOH' },
    ret: { dep: '15:20', arr: '06:35', plus: 1, from: 'DXB', to: 'LOS', dur: '18h 15m', stops: 1, via: 'DOH' }, tags: [] },
  { id: 'f5', al: 'KQ', no: 'KQ 533', cabin: 'Economy', fare: 'Lite', refundable: false, price: 1098900, bag: '1 × 23kg',
    out: { dep: '10:05', arr: '07:40', plus: 1, from: 'LOS', to: 'DXB', dur: '19h 35m', stops: 1, via: 'NBO' },
    ret: { dep: '05:45', arr: '15:00', plus: 0, from: 'DXB', to: 'LOS', dur: '12h 15m', stops: 1, via: 'NBO' }, tags: [] },
  { id: 'f7', al: 'AF', no: 'AF 149', cabin: 'Economy', fare: 'Standard', refundable: true, price: 1356800, bag: '1 × 23kg', operatedBy: { seg: 1, name: 'KLM Royal Dutch Airlines' },
    out: { dep: '23:15', arr: '19:40', plus: 1, from: 'LOS', to: 'DXB', dur: '17h 25m', stops: 1, via: 'CDG' },
    ret: { dep: '02:05', arr: '15:10', plus: 0, from: 'DXB', to: 'LOS', dur: '16h 05m', stops: 1, via: 'CDG' }, tags: [] }
];

OB.airports = {
  LOS: 'Lagos, Murtala Muhammed Intl', DXB: 'Dubai International', ADD: 'Addis Ababa Bole Intl', DOH: 'Doha Hamad Intl',
  IST: 'Istanbul Airport', CDG: 'Paris Charles de Gaulle', NBO: 'Nairobi Jomo Kenyatta Intl', CAI: 'Cairo International', LHR: 'London Heathrow', ABV: 'Abuja Nnamdi Azikiwe Intl', ACC: 'Accra Kotoka Intl'
};

OB.flightExtras = [
  { id: 'reminder', title: 'Travel reminders', desc: 'SMS, WhatsApp and a phone call before check-in opens, plus gate and time changes as they happen.', price: 3000, icon: 'bell', perPax: true },
  { id: 'protocol', title: 'Airport protocol at Lagos', desc: 'A protocol officer meets you at the kerb, handles check-in and walks you through security and immigration.', price: 25000, icon: 'handshake', perPax: true },
  { id: 'lounge', title: 'Lounge access, Lagos Terminal 2', desc: 'Up to 3 hours in the Business Lounge with food, drinks, Wi-Fi and showers.', price: 45000, icon: 'sofa', perPax: true },
  { id: 'data', title: 'Travel data: 5GB eSIM for UAE', desc: 'Instant eSIM activation on landing. Works with all eSIM phones. Valid 15 days.', price: 18000, icon: 'wifi', perPax: true },
  { id: 'insurance', title: 'Travel insurance (Cover+)', desc: 'Medical cover up to €50,000, lost baggage up to €400 and trip cancellation. Ages 0–69.', price: 12000, icon: 'shield', perPax: true },
  { id: 'prime', title: 'Onburd Prime membership', desc: 'Free protocol on every trip, priority support and 5% back on events for 12 months.', price: 18000, icon: 'crown', perPax: false }
];

OB.airportAddons = [
  { id: 'protocol', title: 'Standard protocol service', desc: 'Departure and arrival made easy, from drop-off point to the gate. For business travellers, tourists and VIPs.', price: 25000, icon: 'handshake' },
  { id: 'data', title: 'Travel data: instant global eSIM', desc: 'Stay connected in 250+ destinations without swapping SIM cards. 1GB to start, top up any time. Powered by Univasa.', price: 25000, icon: 'wifi' },
  { id: 'dom-lounge', title: 'Domestic airport lounge', desc: 'Lounge access for domestic flights at MMA2, Lagos. Snacks, drinks and quiet seating.', price: 25000, icon: 'sofa' },
  { id: 'insurance', title: 'Comprehensive travel insurance', desc: '30 days of cover for travellers aged 0–69, including lost or delayed baggage up to €400 and lost passport.', price: 25000, icon: 'shield' },
  { id: 'vip-lounge', title: "VIP lounge, Lagos Int'l Terminal 2", desc: 'Premium lounge before international flights, with a quiet zone, buffet and complimentary drinks.', price: 60000, icon: 'crown' },
  { id: 'kalabash-platinum', title: 'Kalabash Platinum travel card', desc: 'A USD card for global payments with cashback on travel spend. Delivery included.', price: 4500, img: 'card-kalabash-platinum' },
  { id: 'kalabash-elite', title: 'Kalabash World Elite travel card', desc: 'Higher limits, airport lounge passes and concierge support worldwide. Delivery included.', price: 25000, img: 'card-kalabash-elite' }
];

OB.bookings = [
  { ref: 'OB-48213', kind: 'flight', status: 'Upcoming', title: 'Lagos (LOS) → Dubai (DXB)', img: 'dest-dubai', airline: 'QR', date: 'Fri, 18 Dec 2026', booked: '14 Oct 2026', facts: [['Departure', '22:10'], ['Duration', '12h 55m'], ['Arrival', '13:05 +1']], total: 1297600 },
  { ref: 'OB-47790', kind: 'event', status: 'Upcoming', title: 'Afrobeats Live: Lagos Christmas Edition', img: 'event-afrobeats-live', date: 'Sat, 19 Dec 2026', booked: '2 Oct 2026', facts: [['Tickets', '2 × VIP'], ['Doors open', '7:00 PM'], ['Venue', 'Eko Convention Centre']], total: 240000 },
  { ref: 'OB-46102', kind: 'experience', status: 'Current', title: 'Floating Breakfast & Spa Day', img: 'exp-floating-breakfast', date: 'Wed, 14 Oct 2026', booked: '28 Sep 2026', facts: [['Guests', '2 adults'], ['Check-in', '9:00 AM'], ['Location', 'Lekki, Lagos']], total: 170000 },
  { ref: 'OB-39921', kind: 'flight', status: 'Completed', title: 'Abuja (ABV) → Accra (ACC)', img: 'dest-accra', airline: 'KQ', date: 'Sun, 12 Jul 2026', booked: '20 Jun 2026', facts: [['Departure', '10:30'], ['Duration', '2h 05m'], ['Arrival', '11:35']], total: 412800 },
  { ref: 'OB-38510', kind: 'movie', status: 'Completed', title: 'Project Hail Mary (IMAX)', img: 'movie-hail-mary', date: 'Sat, 28 Mar 2026', booked: '27 Mar 2026', facts: [['Seats', 'F7, F8'], ['Showtime', '18:00'], ['Cinema', 'Filmhouse IMAX Lekki']], total: 19000 }
];

OB.reviews = [
  { name: 'Tolu A.', date: 'September 2026', rating: 5, title: 'Worth every naira', body: 'Our guide Ahmed made the pyramids come alive. The Nile cruise cabins were spotless and the balloon ride at sunrise was the highlight of the year.' },
  { name: 'Chiamaka O.', date: 'August 2026', rating: 5, title: 'Smooth from start to finish', body: 'Visa support, transfers and every entry ticket were sorted before we landed. Paying in instalments made it possible to bring my mum.' },
  { name: 'Femi B.', date: 'June 2026', rating: 4, title: 'Great trip, long days', body: 'Packed itinerary with early starts. Book the optional Abu Simbel trip if you can, it is worth the 3am alarm.' }
];

OB.itinerary = [
  ['Day 1', 'Arrive in Cairo', 'Airport pickup, check in at a Nile-view hotel and a welcome dinner in Zamalek.'],
  ['Day 2', 'Pyramids of Giza & the Sphinx', 'Guided tour of the plateau, then the Grand Egyptian Museum in the afternoon.'],
  ['Day 3', 'Fly to Luxor, board the cruise', 'Karnak and Luxor temples, then settle into your cabin on the Nile.'],
  ['Day 4', 'Valley of the Kings', 'Sunrise hot air balloon (optional), royal tombs and the Temple of Hatshepsut.'],
  ['Day 5', 'Edfu & Kom Ombo', 'Sail south with stops at two Ptolemaic temples and a sunset felucca ride in Aswan.'],
  ['Day 6', 'Aswan & departure', 'Philae Temple in the morning, then your flight home.']
];

OB.airportList = [
  ['LOS', 'Lagos', 'Nigeria', 'Murtala Muhammed International Airport'],
  ['ABV', 'Abuja', 'Nigeria', 'Nnamdi Azikiwe International Airport'],
  ['PHC', 'Port Harcourt', 'Nigeria', 'Port Harcourt International Airport'],
  ['KAN', 'Kano', 'Nigeria', 'Mallam Aminu Kano International Airport'],
  ['ENU', 'Enugu', 'Nigeria', 'Akanu Ibiam International Airport'],
  ['ACC', 'Accra', 'Ghana', 'Kotoka International Airport'],
  ['NBO', 'Nairobi', 'Kenya', 'Jomo Kenyatta International Airport'],
  ['ADD', 'Addis Ababa', 'Ethiopia', 'Addis Ababa Bole International Airport'],
  ['KGL', 'Kigali', 'Rwanda', 'Kigali International Airport'],
  ['JNB', 'Johannesburg', 'South Africa', 'O. R. Tambo International Airport'],
  ['CPT', 'Cape Town', 'South Africa', 'Cape Town International Airport'],
  ['CAI', 'Cairo', 'Egypt', 'Cairo International Airport'],
  ['CMN', 'Casablanca', 'Morocco', 'Mohammed V International Airport'],
  ['ZNZ', 'Zanzibar', 'Tanzania', 'Abeid Amani Karume International Airport'],
  ['DXB', 'Dubai', 'United Arab Emirates', 'Dubai International Airport'],
  ['DOH', 'Doha', 'Qatar', 'Hamad International Airport'],
  ['IST', 'Istanbul', 'Türkiye', 'Istanbul Airport'],
  ['LHR', 'London', 'United Kingdom', 'Heathrow Airport'],
  ['LGW', 'London', 'United Kingdom', 'Gatwick Airport'],
  ['CDG', 'Paris', 'France', 'Charles de Gaulle Airport'],
  ['AMS', 'Amsterdam', 'Netherlands', 'Amsterdam Airport Schiphol'],
  ['FRA', 'Frankfurt', 'Germany', 'Frankfurt Airport'],
  ['JFK', 'New York', 'United States', 'John F. Kennedy International Airport'],
  ['IAH', 'Houston', 'United States', 'George Bush Intercontinental Airport'],
  ['ATL', 'Atlanta', 'United States', 'Hartsfield–Jackson Atlanta International Airport'],
  ['YYZ', 'Toronto', 'Canada', 'Toronto Pearson International Airport'],
  ['MLE', 'Malé', 'Maldives', 'Velana International Airport']
].map(([code, city, country, name]) => ({ code, city, country, name }));
OB.popularCities = ['LOS', 'ABV', 'ACC', 'NBO', 'JNB', 'DXB', 'LHR', 'JFK', 'YYZ'];
OB.popularAirports = ['LOS', 'ABV', 'DXB', 'LHR', 'ACC'];
OB.airport = (code) => OB.airportList.find((a) => a.code === code) || { code, city: code, country: '', name: '' };

OB.fmt = (n) => '₦' + Math.round(n).toLocaleString('en-NG');
OB.find = (list, id) => list.find((x) => x.id === id) || list[0];
