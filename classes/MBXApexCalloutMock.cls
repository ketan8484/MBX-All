public class MBXApexCalloutMock implements HttpCalloutMock {
    // Implement this interface method
    public HttpResponse respond(HttpRequest req) {
        // Create a fake response
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('200');
        response.setStatusCode(200);
        return response;
    }
}