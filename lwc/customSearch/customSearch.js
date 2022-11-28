import { LightningElement, wire, api, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOpps from '@salesforce/apex/opportunityController.getOpps';

const columns = [{
        label: 'Opportunity name',
        fieldName: 'nameUrl',
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'name' },
            target: '_blank'
        },
        sortable: true
    }, {
        label: 'Account name',
        fieldName: 'AccountUrl',
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'AccountName' },
            target: '_blank'
        },
        sortable: true
    },
    {
        label: 'Stage Name',
        fieldName: 'stageName',
        type: 'text',
        sortable: true
    },
    {
        label: 'Type',
        fieldName: 'type',
        type: 'text',
        sortable: true
    },
    {
        label: 'Amount',
        fieldName: 'Amount',
        type: 'number',
        sortable: true
    }

];

export default class LightningDatatableExample extends LightningElement {
    @track value;
    @track error;
    @track data;
    @api sortedDirection = 'asc';
    @api sortedBy = 'Name';
    @api searchKey = '';
    result;
    @track allSelectedRows = [];
    @track page = 1;
    @track items = [];
    @track data = [];
    @track columns;
    @track startingRecord = 1;
    @track endingRecord = 0;
    @track pageSize = 5;
    @track totalRecountCount = 0;
    @track totalPage = 0;
    isPageChanged = false;
    initialLoad = true;
    mapoppNameVsOpp = new Map();;

    @wire(getOpps, { searchKey: '$searchKey', sortBy: '$sortedBy', sortDirection: '$sortedDirection' })
    wiredAccounts({ error, data }) {
        if (data) {
            this.processRecords(data);
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    processRecords(data) {
            this.items = data;
            this.totalRecountCount = data.length;
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);

            this.data = this.items.slice(0, this.pageSize);
            this.endingRecord = this.pageSize;
            this.columns = columns;
        }
        //clicking on previous button this method will be called
    previousHandler() {
        this.isPageChanged = true;
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
        var selectedIds = [];
        for (var i = 0; i < this.allSelectedRows.length; i++) {
            selectedIds.push(this.allSelectedRows[i].Id);
        }
        this.template.querySelector(
            '[data-id="table"]'
        ).selectedRows = selectedIds;
    }

    //clicking on next button this method will be called
    nextHandler() {
        this.isPageChanged = true;
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);
        }
        var selectedIds = [];
        for (var i = 0; i < this.allSelectedRows.length; i++) {
            selectedIds.push(this.allSelectedRows[i].Id);
        }
        this.template.querySelector(
            '[data-id="table"]'
        ).selectedRows = selectedIds;
    }

    //this method displays records page by page
    displayRecordPerPage(page) {

        this.startingRecord = ((page - 1) * this.pageSize);
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) ?
            this.totalRecountCount : this.endingRecord;

        this.data = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }

    sortColumns(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        return refreshApex(this.result);

    }

    onRowSelection(event) {
        if (!this.isPageChanged || this.initialLoad) {
            if (this.initialLoad) this.initialLoad = false;
            this.processSelectedRows(event.detail.selectedRows);
        } else {
            this.isPageChanged = false;
            this.initialLoad = true;
        }

    }
    processSelectedRows(selectedOpps) {
        var newMap = new Map();
        for (var i = 0; i < selectedOpps.length; i++) {
            if (!this.allSelectedRows.includes(selectedOpps[i])) {
                this.allSelectedRows.push(selectedOpps[i]);
            }
            this.mapoppNameVsOpp.set(selectedOpps[i].Name, selectedOpps[i]);
            newMap.set(selectedOpps[i].Name, selectedOpps[i]);
        }
        for (let [key, value] of this.mapoppNameVsOpp.entries()) {
            if (newMap.size <= 0 || (!newMap.has(key) && this.initialLoad)) {
                const index = this.allSelectedRows.indexOf(value);
                if (index > -1) {
                    this.allSelectedRows.splice(index, 1);
                }
            }
        }
    }

    handleKeyChange(event) {
        this.searchKey = event.target.value;

        var theSearchKey = event.target.value;
        var data = [];

        console.log('items==>' + JSON.stringify(this.items));

        for (var i = 0; i < this.items.length; i++) {

            console.log('items==>' + JSON.stringify(this.items[i]));
            var theStr = JSON.stringify(this.items[i]);
            if (this.items[i] != undefined && (theStr.includes(theSearchKey) || theStr.includes(theSearchKey) || theStr.includes(theSearchKey) || theStr.includes(theSearchKey) || theStr.includes(theSearchKey))) {

                console.log('Hello World');
                data.push(this.items[i]);
                console.log('Hello World1');

            }
        }
        this.processRecords(data);
    }

}