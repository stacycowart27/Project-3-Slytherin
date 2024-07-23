import pandas as pd
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
import folium
from folium.plugins import HeatMap
import time
import os

# Load the data
csv_file = 'shark_attacks.csv'
try:
    data = pd.read_csv(csv_file)
except FileNotFoundError:
    print(f"Error: The file {csv_file} was not found.")
    exit()

# Initialize geolocator
geolocator = Nominatim(user_agent="shark_attack_heatmap")

# Function to geocode country and state
def geocode_location(Country, State):
    try:
        location = geolocator.geocode(f"{State}, {Country}")
        if location:
            return location.latitude, location.longitude
        else:
            print(f"Warning: Geocoding failed for {State}, {Country}.")
            return None, None
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        print(f"Error geocoding {State}, {Country}: {e}")
        return None, None

# Apply geocoding to each row with a delay to respect rate limits
data['latitude'], data['longitude'] = zip(*data.apply(
    lambda row: geocode_location(row['Country'], row['State']) 
    if pd.notnull(row['State']) and pd.notnull(row['Country']) else (None, None), axis=1))

# Remove rows where geocoding failed
data = data.dropna(subset=['latitude', 'longitude'])

# Aggregate data to count occurrences at each location
location_counts = data.groupby(['latitude', 'longitude']).size().reset_index(name='count')

# Initialize the map centered around a specific location
m = folium.Map(location=[0, 0], zoom_start=2)

# Prepare data for HeatMap
heat_data = [[row['latitude'], row['longitude'], row['count']] for index, row in location_counts.iterrows()]

# Create and add heat map to the base map
HeatMap(heat_data).add_to(m)

# Add title
title_html = '''
             <div style="position: fixed; 
             top: 10px; width: 100%; text-align: center; 
             font-size: 24px; font-weight: bold;">
             Shark Attack Heat Map
             </div>
             '''
m.get_root().html.add_child(folium.Element(title_html))

# Add legend
legend_html = '''
     <div style="position: fixed; 
     bottom: 50px; left: 50px; width: 200px; height: 120px; 
     background-color: white; border:2px solid grey; z-index:9999; font-size:14px;
     padding: 10px;
     ">&nbsp; Shark Attack Heat Map <br>
     &nbsp; - Higher intensity indicates more attacks <br>
      </div>
     '''
m.get_root().html.add_child(folium.Element(legend_html))

# Define the output file path
output_file = 'shark_attack_heat_map.html'

# Save the map to an HTML file
try:
    m.save(output_file)
    if os.path.exists(output_file):
        print(f"Map successfully saved to {output_file}")
    else:
        print("Error: The map was not saved.")
except Exception as e:
    print(f"Error saving the map: {e}")
