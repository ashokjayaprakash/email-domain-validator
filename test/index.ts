import * as chai from "chai";
import * as EmailValidator from "../index";
import * as chaiAsPromised from "chai-as-promised";

before("Hook Before", function() {
    chai.should();
    chai.use(chaiAsPromised);
});

describe("Email Validator", function()  {
    describe("#validateEmail", function()  {
        it("it should be a function", function()  {
            chai.expect(EmailValidator.validateEmail).to.be.a("function")
        });
    });

    describe("#getDomainFromEmail", function()  {
        it("it should be a function", function()  {
            chai.expect(EmailValidator.getDomainFromEmail).to.be.a("function")
        });
    });

    describe("#validate", function()  {
        this.timeout(10000);            
        it("it should be a function", function()  {
            chai.expect(EmailValidator.validate).to.be.a("function")
        });

        it("should be return true", function() {
            return EmailValidator.validate("test@gmail.com").should.be.eventually.equal(true);
        })

        it("should be rejected", function() {
            return EmailValidator.validate("test@gmailxyz.com").should.be.eventually.rejected;
        })

        it("should be rejected with error properties", function() {
            const expectedKeys = ["code", "errno", "syscall", "hostname"];
            return chai.expect(EmailValidator.validate("test@gmailxyz.com")).to.be.rejected
                    .and.to.eventually.have.all.keys(expectedKeys);
        })

        it("should be rejected with expected error", function() {
            const expectedError = {
                "code":"ENOTFOUND",
                "errno":"ENOTFOUND",
                "syscall":"queryMx",
                "hostname":"gmailxyz.com"
            };
            return chai.expect(EmailValidator.validate("test@gmailxyz.com")).to.be.rejected
                    .and.to.eventually.have.all.keys(expectedError);
        })
    });
});