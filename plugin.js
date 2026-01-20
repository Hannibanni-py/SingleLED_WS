// -------------------- Device Info --------------------
export function Name() { return "Single LED WS Device"; }
export function Publisher() { return "YourName"; }

export function VendorId() { return 0x1234; }   // Dummy Vendor ID, adjust if needed
export function ProductId() { return 0x5678; }  // Dummy Product ID, adjust if needed

// -------------------- Canvas Size & Position --------------------
export function Size() { return [1, 1]; }        // Single LED => 1x1
export function DefaultPosition() { return [0, 0]; }
export function DefaultScale() { return 8.0; }

// -------------------- LED Definition --------------------
var vLedNames = ["Single LED"];
export function LedNames() { return vLedNames; }

var vLedPositions = [[0, 0]];  // Only one LED at position [0,0]
export function LedPositions() { return vLedPositions; }

// -------------------- Device Parameters --------------------
export function ControllableParameters() {  
    return [];  // No extra user controls
}

// -------------------- Validation --------------------
export function Validate(endpoint) {  
    // Allow all endpoints for simplicity
    return true;
}

// -------------------- Device Type --------------------
export function Type() { return "HID"; }  // Default protocol

// -------------------- Conflicting Processes --------------------
export function ConflictingProcesses() {  
    return [];  // No conflicts
}

// -------------------- Device Image --------------------
export function ImageUrl() { return ""; } // Optional URL for device image

// -------------------- WebSocket Setup --------------------
let ws = null;

// Open WebSocket when plugin is initialized
export function Initialize(device) {
    ws = new WebSocket("ws://localhost:8765");
    
    ws.onopen = () => {
        console.log("WebSocket connected to ws://localhost:8765");
    };
    
    ws.onmessage = (event) => {
        try {
            let data = JSON.parse(event.data);
            if (data.color && data.color.length === 3) {
                let [r, g, b] = data.color;
                // Update the LED color
                device.set_led_color(0, r, g, b);
            }
        } catch (err) {
            console.error("Invalid JSON received:", event.data);
        }
    };

    ws.onclose = () => {
        console.log("WebSocket closed");
    };

    ws.onerror = (err) => {
        console.error("WebSocket error:", err);
    };
}

// Close WebSocket when plugin is unloaded
export function Shutdown(device) {
    if (ws) {
        ws.close();
        ws = null;
    }
}

// -------------------- Render Loop --------------------
export function Render(device) {
    // Nothing to do here; colors are updated via WebSocket
}
