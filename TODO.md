# 🗺️ Map Integration TODO (For Map Contributor)

Welcome! This document outlines what needs to be done to integrate the interactive map component into the Cognivantha prototype.

## 📍 Target File
You will be working in:
* **[src/components/IssueMap.jsx](file:///c:/Cognivantha/src/components/IssueMap.jsx)**

Currently, it renders a gray placeholder box. You need to replace this with a real interactive map (such as **Leaflet** or **Mapbox**).

---

## 🛠️ Step-by-Step Tasks

### 1. Install Mapping Dependencies
Choose a map library and install it. For example, if you choose **Leaflet** and **React-Leaflet**:
```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```
*(Don't forget to import Leaflet's CSS file in your component or `main.tsx`: `import 'leaflet/dist/leaflet.css';`)*

### 2. Parse coordinates from the mock data
The `issues` array is passed as a prop to `<IssueMap issues={issues} />`.
The mock issues store location coordinates as strings in the format: `"Lat 12.9716, Lng 77.5946"`. 
You will need to parse these strings into numeric values `[lat, lng]` to map them. 
*Hint:* You can use a utility regex to extract numbers:
```javascript
const parseCoords = (locationStr) => {
  if (!locationStr) return [12.9716, 77.5946]; // Default fallback (e.g., Bangalore center)
  const matches = locationStr.match(/[-+]?[0-9]*\.?[0-9]+/g);
  if (matches && matches.length >= 2) {
    return [parseFloat(matches[0]), parseFloat(matches[1])];
  }
  return [12.9716, 77.5946];
};
```

### 3. Render the Map and Place Pins
- Render the Map centered around a local area (e.g. Bangalore center: `[12.9716, 77.5946]`).
- Loop over the `issues` array and render a Marker/Pin for each issue at its parsed coordinates.

### 4. Style Pins based on Priority
Visual triage is important! Try to style the markers using different colors depending on the priority level:
- 🔴 **High Priority:** Red Marker
- 🟡 **Medium Priority:** Yellow/Orange Marker
- 🟢 **Low Priority:** Green Marker

### 5. Add Popups with Details
When a user clicks on a map marker, open a Popup showing:
- Issue Title
- Category & Status
- Description
- Clickable link or button to view more details on the card.
