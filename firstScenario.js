import { LightningElement,track,wire,api } from 'lwc';
import getAllOpps from '@salesforce/apex/GetAllOpportunities.getAllOpps';
//import { getRecord, getFieldValue }  from 'lightning/uiRecordApi';
import fatchPickListValue from '@salesforce/apex/getPickListValueInLwcCtrl.fatchPickListValue';
import getHiearchySettings from '@salesforce/apex/GetAllOpportunities.getHiearchySettings';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' }
];

export default class FilterComponent extends NavigationMixin(LightningElement)  {
    
    get Owner() {
        return getFieldValue(this.Opportunity.data, OWNER_NAME);
      }
    connectedCallback() {
        this.Contact=true;
    }
   
    @wire(fatchPickListValue, {objInfo: {'sobjectType' : 'ServiceTokens__c'},
                            picklistFieldApi: 'Token__c'}) stageNameValues;
 
    @track selectedOption;
    @track Account;
    @track Contact;
    @track Case;
    @api recordId;
    @track dcnInput;
    @track value1;
    @track tempObj = {};
    @track columns = [{
        label: 'Name',
        fieldName: 'Name',
        type: 'button',        
        sortable:true,
        wrapText: true ,
        typeAttributes:{
            label: {fieldName: 'Name'},
            name:'view_Task'
        }
    },
    
        {
        label: 'Website',
        fieldName: 'Website',
        type: 'url', 
        typeAttributes:{label: 'Test',target:'_blank'},       
        sortable:true,
        wrapText: true 
    },

    {
        label: 'Type',
        fieldName: 'Type',
        type: 'text',
        sortable: true
    },
    {
        api: 'Owner.Name',
        label: 'Owner',
        fieldName: 'OwnerName',
        type: 'text',
        sortable: true,
       
    },
    {
        label: 'AnnualRevenue',
        fieldName: 'AnnualRevenue',
        type: 'number',
        sortable: true
        
    },
    {
        label: 'Active',
        fieldName: 'Active',
        type: 'text',
        sortable: true
    },
    {
        label: 'Industry',
        fieldName: 'Industry',
        type: 'text',
        sortable: true
    }

];
@track error;
@track data ;
@track cs;
@wire(getAllOpps)
    wiredcs({
        error,
        data
    }) {
        if (data) {
           // alert("tempobj"+this.tempObj);
            this.cs = data;
            //alert('thiscs'+this.cs);
            console.log(data);
           // console.log(JSON.stringify(data, null, '\t'));
        } else if (error) {
            this.error = error;
        }
    }
    @track data1;
@wire(getAllOpps,{tempobj: '$tempObj',value: '$value1'})
    wiredOpps(result){
     
        if (result.data) {
            let preparedAddresses = [];
        result.data.forEach(address =>  {
            let preparedAddress = {};   
            preparedAddress.Name = address.Name;
            preparedAddress.Website = address.Website;
            preparedAddress.Type = address.Id;
            preparedAddress.OwnerName = address.Owner.Name;
            preparedAddress.AnnualRevenue = address.OwnerId;
            preparedAddress.Active = address.Active__c;
            preparedAddress.Industry = address.Industry;
            // and so on for other fields
            preparedAddresses.push(preparedAddress);
        });
        this.data1 = preparedAddresses;
            
        } else if (result.error) {
            this.error = error;
        }
    
}

handlerowaction(event){
    alert('Testing');
    alert('Testing1'+event.detail.row);
    alert('Testing1'+event.detail.row.id);
    var row1=event.detail.row;
    console.log('Testing1'+JSON.stringify(event.detail.row));
    console.log('Row1'+row1);
}
    
        handleSubmitLead(event) {
            event.preventDefault(); // stop the form from submitting
            var dcnInput=this.template.querySelector('[data-id ="selector1"]');
            var value = dcnInput.value;
            var tempObj1 = {};
            const fields = event.detail.fields;
            console.log(JSON.stringify(fields));
            console.log(fields);
            var field1 = JSON.stringify(fields);            
            alert('Contact Field'+field1);
            this.tempObj=field1;
            this.value1 = value;
            console.log(tempObj1);
            alert('Test'+value);
        refreshApex(this.wiredOpps);
            alert("you have selected : "+dcnInput);
        /* alert("you have selected : "+fields.AccountNumber.value);
            alert("you have selected : "+fields.AccountSource.value);
            alert("you have selected : "+fields.Phone.value);
            alert("you have selected : "+fields.Site.value);
            alert("you have selected : "+fields.Industry.value);
            alert("you have selected : "+fields.Type.value);*/

        }
    handleSearch(event){
        var dcnInput=this.template.querySelector('[data-id ="selector1"]');
        var value = dcnInput.value;
        this.value1 = value;
        this.tempObj='';
        refreshApex(this.wiredOpps);
    }
    handleReset(event){
        var dcnInput=this.template.querySelector('[data-id ="selector1"]');
        var value = dcnInput.value;
        console.log('value'+value);
        dcnInput.value='';
        value='';
        console.log('value'+value);
    }
    @track activeSections = ['A','B', 'C'];
    changeHandler1(event){
        if( event.target.name == 'tag_name_0' ){
             var dcnInput = event.target.value;
            //alert('Test'+dcnInput);
        }
    }
    changeHandler(event) {
    const field = event.target.name;
    if (field === 'optionSelect') {
        this.selectedOption = event.target.value;
        
        } 
        if(this.selectedOption==='Account'){
            this.Account=true;
            this.Case=false;
            this.Contact=false;
    }   
    if(this.selectedOption==='Contact'){
            this.Account=false;
            this.Case=false;
            this.Contact=true;
    }
    if(this.selectedOption==='Case'){
            this.Account=false;
            this.Case=true;
            this.Contact=false;
    }

    
}
navigateNext() {
    alert('Testing');
    this.recordId='0032v00003R3yiWAAR';
    /* var tabName='NewTab'; 
    this[NavigationMixin.Navigate]({
        type: 'standard__navItemPage',
        attributes: {
            apiName: "NewTab"
        },
        state:{
            c__recordId: "0032v00003R3yiWAAR"
        }
    });*/
}
}