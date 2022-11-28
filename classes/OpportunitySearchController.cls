public with sharing class OpportunitySearchController {
    
    @AuraEnabled(cacheable=true)
    public static List<DataTableWrapper> getOpps( String searchKey) {
        
        String query = 'SELECT Id, Name, StageName, Type, Amount, AccountId, Account.Name, CloseDate FROM Opportunity';
        system.debug('query---'+query);
        if ( searchKey != null && searchKey != '' ) {
            
            Decimal theAmount;
            try{
                theAmount = decimal.valueOf(searchKey);
            }
            catch(Exception e) {}
            
            String key = '%' + searchKey + '%';
        
            if(theAmount != null) query += ' WHERE Amount =: theAmount';
            else query += ' WHERE Name LIKE :key OR  StageName LIKE :key OR  Type LIKE :key OR Account.Name Like: key';
        
        }
        // if (sortBy != null && sortDirection != null ) {
        //     query += ' ORDER BY ' + sortBy + ' ' + sortDirection;
        // }
        System.debug('query==>'+query);
        query = query;
        // String.escapeSingleQuotes(sortBy);
        // String.escapeSingleQuotes(sortDirection);
        List<Opportunity> theOppList = Database.query( query );
        
        List<DataTableWrapper> response = new List<DataTableWrapper>();
        for(Opportunity opp : theOppList){
            DataTableWrapper obj = new DataTableWrapper();
            obj.oppId = opp.Id;
            obj.name = opp.Name;
            obj.nameUrl = '/'+opp.Id;
            obj.stageName = opp.StageName;
            obj.type = opp.Type;
            obj.amount = opp.Amount;
            if(opp.AccountId!=null) { 
                obj.accountUrl = '/'+opp.AccountId;
                obj.accountName = opp.Account.Name;
            }
            response.add(obj);
        }

        return response;
    }
    
    @AuraEnabled
    public static void getOppAPI(String theRecordId) {
        String theResponse = MBXApexCallout.getOppAPI();
        Opportunity theOpp = new Opportunity();
        theOpp.Id = theRecordId;
        theOpp.Integration_Status__c = theResponse;
        theOpp.Integration_Comments__c = theResponse;
        
        if(theResponse != 'Success') {
            throw new AuraHandledException(theResponse);
        }
        else {
            update theOpp;
        }
        
    }
    
    public class DataTableWrapper {
        @AuraEnabled
        public Id oppId {get;set;}
        @AuraEnabled
        public String name {get;set;}
        @AuraEnabled
        public String nameUrl {get;set;}
        @AuraEnabled
        public String accountUrl {get;set;}
        @AuraEnabled
        public String accountName {get;set;}
        @AuraEnabled
        public String stageName {get;set;}
        @AuraEnabled
        public String type {get;set;}
        @AuraEnabled
        public decimal amount {get;set;}
    }
}