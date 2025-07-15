const {  prepare_and_run_distance } = require('./utils.js')

self.onmessage = (event) => {
    try {
        // Filter out browser extension messages (MetaMask, etc.)
        if (event.data && event.data.target) {
            return;
        }
        
        // Check if this is already a result message (to prevent infinite loops)
        if (event.data && event.data.hasOwnProperty('no_distance_message')) {
            return;
        }
        
        if (!event.data || !event.data.mod1 || !event.data.mod2) {
            return;
        }
        
        postMessage(prepare_and_run_distance(event.data.mod1,event.data.mod2 ));
    } catch (error) {
        console.error('Error in distance worker:', error);
        postMessage({
            'no_distance_message': 'Distance computation failed',
            'clade': false,
            'RF': false,
            'Euc': false,
            'RF_good': false,
            'RF_left': false,
            'RF_right': false,
            'Cl_good': false,
            'Cl_left': false,
            'Cl_right': false
        });
    }
};


