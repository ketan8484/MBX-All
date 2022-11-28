public class MBXApexCallout {

    @AuraEnabled(cacheable=true)
    public static String getOppAPI() {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://th-apex-http-callout.herokuapp.com/animals');
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        if(response.getStatusCode() == 200) {
            return 'Success';            
        } else {
            return 'Error :'+response.getStatus() + ' '+response.getBody() ;
        }
    }
    
}