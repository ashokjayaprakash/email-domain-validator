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
            chai.expect(EmailValidator.validateEmail).to.be.a("function")
        });
    });

    describe("#validateEmailDomain", function()  {
        it("it should be a function", function()  {
            chai.expect(EmailValidator.validate).to.be.a("function")
        });
    });
});