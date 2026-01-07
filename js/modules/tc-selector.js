export const TCSelector = {
    tcData: null,

    async init() {
        await this.loadData();
    },

    async loadData() {
        try {
            const response = await fetch('./js/data/tc-numbers.json');
            this.tcData = await response.json();
        } catch (e) {
            console.error('TC data load error:', e);
            this.tcData = {};
        }
    },

    getTCList(transportType, routeNumber) {
        if (transportType !== 'Трамвай') {
            return [];
        }

        const route = String(routeNumber).trim();
        return this.tcData[route] || [];
    },

    hasTCList(transportType, routeNumber) {
        return this.getTCList(transportType, routeNumber).length > 0;
    }
};
