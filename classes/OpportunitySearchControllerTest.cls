@isTest
public class OpportunitySearchControllerTest {
    
    @testSetup
    public static void setup(){
        Account testAcc = new Account();
        testAcc.Name = 'test Acc';
        insert testAcc;
        
        Opportunity testOpp = new Opportunity();
        testOpp.name = 'Test';
        testOpp.AccountId = testAcc.Id;
        testOpp.StageName = 'Prospecting';
        testOpp.CloseDate = System.today();
        insert testOpp;
    }
    
    @isTest
    public static void getOppsTest() {
        
        Test.startTest();
        List<OpportunitySearchController.DataTableWrapper> testApexList = OpportunitySearchController.getOpps('Test');
        Test.stopTest();
        
        //Assertion
        System.assertEquals(1, testApexList.size());
        
    }
    
    @isTest
    public static void testApexCallout() {
        Test.setMock(HttpCalloutMock.class, new MBXApexCalloutMock());
        Opportunity theOpp = [SELECT Id FROM Opportunity];
        
        Test.startTest();
        OpportunitySearchController.getOppAPI(theOpp.Id);
        Test.stopTest();
        
        //Assertion
        Opportunity testAssertOpp = [SELECT Id, 	Integration_Status__c, Integration_Comments__c FROM Opportunity];
        System.assertEquals('Success', testAssertOpp.Integration_Status__c);
        System.assertEquals('Success', testAssertOpp.Integration_Comments__c);
    }
    
}