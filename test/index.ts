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
            chai.expect(EmailValidator.getEmailDomain).to.be.a("function")
        });
    });

    describe("#validate", function()  {
        this.timeout(10000);     
               
        it("it should be a function", function()  {
            chai.expect(EmailValidator.validateEmail).to.be.a("function");
        });

        it("should be return internet connectivity error", function() {
            return EmailValidator.validate("test@gmail.com").should.be.fulfilled;
        })

        it("should return true for single emailid", function() {
            const result: any = {
                isValidDomain: true,
                erorrMessage: [],
                invalidEmailList: []
            };
            return EmailValidator.validate("test@gmail.com").should.fulfilled
                    .and.to.eventually.have.all.keys('isValidDomain', 'erorrMessage', 'invalidEmailList')
                    .and.to.deep.equal(result);
        })

        it("should be fulfilled when invalid data given", function() {
            return EmailValidator.validate("test").should.be.eventually.fulfilled;
        })

        it("should be fulfilled when multiple invalid data given", function() {
            return EmailValidator.validate("test, null, '', '\t', 'welcome' ").should.be.eventually.fulfilled;
        })

        it("should be fullfilled", function() {
            return EmailValidator.validate("test@gmail.com").should.be.eventually.fulfilled;
        })

        it("should return error message when email id is empty", function() {
            const result: any = { isValidDomain: false,
                erorrMessage: [ '"" is not allowed to be empty' ],
                invalidEmailList: [ '' ] }
            return chai.expect(EmailValidator.validate("")).to.be.fulfilled
                                .and.to.eventually.have.all.keys('isValidDomain', 'erorrMessage', 'invalidEmailList')
                                .and.to.deep.equal(result);
        })

        it("should return error message when multiple invalid data is given", function() {
            const result: any = { isValidDomain: false,
                erorrMessage:
                 [ '"undefined" must be a valid email',
                   '"data" must be a valid email' ],
                invalidEmailList: [ 'undefined', 'data' ] }
            return chai.expect(EmailValidator.validate("undefined, data")).to.be.fulfilled
            .and.to.eventually.have.all.keys('isValidDomain', 'erorrMessage', 'invalidEmailList')
            .and.to.deep.equal(result);
        })

        it("should return error message when undefined is given", function() {
            const result: any = { isValidDomain: false,
                erorrMessage:
                 [ '"undefined" must be a valid email' ],
                invalidEmailList: [ 'undefined'] }
            let data = `undefined`;
            return chai.expect(EmailValidator.validate(data)).to.be.fulfilled
            .and.to.eventually.have.all.keys('isValidDomain', 'erorrMessage', 'invalidEmailList')
            .and.to.deep.equal(result);
        })

        it("should return true when single email id with valid domain is given", function() {
            const result: any = { isValidDomain: true, erorrMessage: [], invalidEmailList: [] };
            let data = "xyz@gmail.com";
            return chai.expect(EmailValidator.validate(data)).to.be.fulfilled
                    .and.to.eventually.have.all.keys('isValidDomain', 'erorrMessage', 'invalidEmailList')
                    .and.to.deep.equal(result);
        })

        it("should return true when multiple email id is given", function() {
            const result: any = {
                isValidDomain: true,
                erorrMessage: [],
                invalidEmailList: []
            };
            let data = "xyz@gmail.com, xyz@hotmail.com, xyz@yahoo.com, xyz@msn.com";
            return chai.expect(EmailValidator.validate(data)).to.be.fulfilled
                        .and.to.eventually.have.all.keys('isValidDomain', 'erorrMessage', 'invalidEmailList')
                        .and.to.deep.equal(result);
        })

        it("should return true when 1 valid email id, i invalid email id and 1 invalid data is given", function() {
            const result: any = { isValidDomain: false,
                erorrMessage:
                 [ '"" is not allowed to be empty',
                   'xyz@yah6676oo.c5om - queryMx ENOTFOUND yah6676oo.c5om',
                   '"data" must be a valid email' ],
                invalidEmailList: [ '', 'xyz@yah6676oo.c5om', 'data' ] };
                
            let data = ", xyz@hotmail.com, xyz@yah6676oo.c5om, data";
            return chai.expect(EmailValidator.validate(data)).to.be.fulfilled
                        .and.to.eventually.have.all.keys('isValidDomain', 'erorrMessage', 'invalidEmailList')
                        .and.to.deep.equal(result);
        })

        it("should return true when 25 valid email id is given", function() {
            const result: any = {
                isValidDomain: true,
                erorrMessage: [],
                invalidEmailList: []
            };
            let data = `xyz@gmail.com,    xyz@hotmail.com, xyz@yahoo.com, xyz@msn.com, xyz@abc.com,
                        xyz@gmail.com  , xyz@hotmail.com, xyz@yahoo.com, xyz@msn.com, xyz@abc.com,
                        xyz@gmail.com  , xyz@hotmail.com,    xyz@yahoo.com, xyz@msn.com, xyz@abc.com,
                        xyz@gmail.com   , xyz@hotmail.com, xyz@yahoo.com, xyz@msn.com, xyz@abc.com,
                        xyz@gmail.com, xyz@hotmail.com, xyz@yahoo.com, xyz@msn.com   , xyz@abc.com`;
            return chai.expect(EmailValidator.validate(data)).to.be.fulfilled
                    .and.to.eventually.have.all.keys('isValidDomain', 'erorrMessage', 'invalidEmailList')
                    .and.to.deep.equal(result);
        })

        it("should return failure when invalid email id is given", function() {
            const expectedError = { 
                isValidDomain: false,
                erorrMessage: [ 'xyz@hotmailzy.com - queryMx ENOTFOUND hotmailzy.com',
                                'xyz@msm.com - queryMx ENODATA msm.com'],
                invalidEmailList: [ 'xyz@hotmailzy.com', 'xyz@msm.com'] 
            };
            let data = `xyz@gmail.com,    xyz@hotmail.com, xyz@yahoo.com, xyz@msn.com, xyz@abc.com,
                        xyz@gmail.com  , xyz@hotmail.com, xyz@yahoo.com, xyz@msn.com, xyz@abc.com,
                        xyz@gmail.com  , xyz@hotmailzy.com,    xyz@yahoo.com, xyz@msn.com, xyz@abc.com,
                        xyz@gmail.com   , xyz@hotmail.com, xyz@yahoo.com, xyz@msn.com, xyz@abc.com,
                        xyz@gmail.com, xyz@hotmail.com, xyz@yahoo.com, xyz@msm.com   , xyz@abc.com`;
            return chai.expect(EmailValidator.validate(data)).to.be.fulfilled
                    .and.to.eventually.have.all.keys('isValidDomain', 'erorrMessage', 'invalidEmailList')
                    .and.to.deep.equal(expectedError);
        })

        it("should return true when multiple email id provided", function() {
            const result: any = {
                isValidDomain: true,
                erorrMessage: [],
                invalidEmailList: []
            };
            let data = `xyz@gmail.com,
            xyz@yahoo.com,
            xyz@hotmail.com,
            xyz@aol.com,
            xyz@hotmail.co.uk,
            xyz@hotmail.fr,
            xyz@msn.com,
            xyz@yahoo.fr,
            xyz@wanadoo.fr,
            xyz@orange.fr,
            xyz@comcast.net,
            xyz@yahoo.co.uk,
            xyz@yahoo.com.br,
            xyz@yahoo.co.in,
            xyz@live.com,
            xyz@rediffmail.com,
            xyz@free.fr,
            xyz@gmx.de,
            xyz@web.de,
            xyz@yandex.ru,
            xyz@ymail.com,
            xyz@libero.it,
            xyz@outlook.com,
            xyz@uol.com.br,
            xyz@bol.com.br,
            xyz@mail.ru,
            xyz@cox.net,
            xyz@hotmail.it,
            xyz@sbcglobal.net,
            xyz@sfr.fr,
            xyz@live.fr,
            xyz@verizon.net,
            xyz@live.co.uk,
            xyz@googlemail.com,
            xyz@yahoo.com,
            xyz@live.nl,
            xyz@bigpond.com,
            xyz@terra.com.br,
            xyz@yahoo.it,
            xyz@neuf.fr,
            xyz@yahoo.de,
            xyz@alice.it,
            xyz@rocketmail.com,
            xyz@att.net,
            xyz@laposte.net,
            xyz@facebook.com,
            xyz@bellsouth.net,
            xyz@yahoo.in,
            xyz@hotmail.es,
            xyz@charter.net,
            xyz@yahoo.ca,
            xyz@yahoo.com.au,
            xyz@rambler.ru,
            xyz@hotmail.de,
            xyz@tiscali.in,
            xyz@yahoo.co.in,
            xyz@yahoo.co.in,
            xyz@earthlink.net,
            xyz@optonline.net,
            xyz@freenet.de,
            xyz@t-online.de,
            xyz@aliceadsl.fr,
            xyz@virgilio.it,
            xyz@home.nl,
            xyz@qq.com,
            xyz@telenet.be,
            xyz@me.com,
            xyz@yahoo.com.ar,
            xyz@tiscali.co.uk,
            xyz@yahoo.com.mx,
            xyz@mail.com,
            xyz@gmx.net,
            xyz@mail.com,
            xyz@planet.nl,
            xyz@tin.it,
            xyz@live.it,
            xyz@ntlworld.com,
            xyz@arcor.de,
            xyz@yahoo.co.id,
            xyz@frontiernet.net,
            xyz@hetnet.nl,
            xyz@live.com.au,
            xyz@yahoo.com.sg,
            xyz@zonnet.nl,
            xyz@club-internet.fr,
            xyz@juno.com,
            xyz@optusnet.com.au,
            xyz@blueyonder.co.uk,
            xyz@bluewin.ch,
            xyz@skynet.be,
            xyz@sympatico.ca,
            xyz@windstream.net,
            xyz@mac.com,
            xyz@testing.com
            `;
            return chai.expect(EmailValidator.validate(data)).to.be.fulfilled
                        .and.to.eventually.have.all.keys('isValidDomain', 'erorrMessage', 'invalidEmailList')
                        .and.to.deep.equal(result);
        })

        it("should return failure when invalid email id is given with multiple id", function() {
            const error = {
                "isValidDomain": false,
                "erorrMessage": [
                    "xyz@gmail.com.ra - queryMx ENOTFOUND gmail.com.ra",
                    "xyz@yahoo.com.ra - queryMx ENOTFOUND yahoo.com.ra",
                    "xyz@hotmail.com.ra - queryMx ENOTFOUND hotmail.com.ra",
                    "xyz@aol.com.ra - queryMx ENOTFOUND aol.com.ra",
                    "xyz@hotmail.fr.ra - queryMx ENOTFOUND hotmail.fr.ra",
                    "xyz@msn.com.ra - queryMx ENOTFOUND msn.com.ra",
                    "xyz@macramaswamy.com - queryMx ENOTFOUND macramaswamy.com"
                ],
                "invalidEmailList": [
                    "xyz@gmail.com.ra",
                    "xyz@yahoo.com.ra",
                    "xyz@hotmail.com.ra",
                    "xyz@aol.com.ra",
                    "xyz@hotmail.fr.ra",
                    "xyz@msn.com.ra",
                    "xyz@macramaswamy.com"
                ]
            };            
            
            let data = `xyz@gmail.com.ra,
            xyz@yahoo.com.ra,
            xyz@hotmail.com.ra,
            xyz@aol.com.ra,
            xyz@hotmail.co.uk,
            xyz@hotmail.fr.ra,
            xyz@msn.com.ra,
            xyz@yahoo.fr,
            xyz@wanadoo.fr,
            xyz@orange.fr,
            xyz@comcast.net,
            xyz@yahoo.co.uk,
            xyz@yahoo.com.br,
            xyz@yahoo.co.in,
            xyz@live.com,
            xyz@rediffmail.com,
            xyz@free.fr,
            xyz@gmx.de,
            xyz@web.de,
            xyz@yandex.ru,
            xyz@ymail.com,
            xyz@libero.it,
            xyz@outlook.com,
            xyz@uol.com.br,
            xyz@bol.com.br,
            xyz@mail.ru,
            xyz@cox.net,
            xyz@hotmail.it,
            xyz@sbcglobal.net,
            xyz@sfr.fr,
            xyz@live.fr,
            xyz@verizon.net,
            xyz@live.co.uk,
            xyz@googlemail.com,
            xyz@yahoo.com,
            xyz@ig.com.br,
            xyz@live.nl,
            xyz@bigpond.com,
            xyz@terra.com.br,
            xyz@yahoo.it,
            xyz@neuf.fr,
            xyz@yahoo.de,
            xyz@alice.it,
            xyz@rocketmail.com,
            xyz@att.net,
            xyz@laposte.net,
            xyz@facebook.com,
            xyz@bellsouth.net,
            xyz@yahoo.in,
            xyz@hotmail.es,
            xyz@charter.net,
            xyz@yahoo.ca,
            xyz@yahoo.com.au,
            xyz@rambler.ru,
            xyz@hotmail.de,
            xyz@tiscali.in,
            xyz@yahoo.co.in,
            xyz@yahoo.co.in,
            xyz@earthlink.net,
            xyz@optonline.net,
            xyz@freenet.de,
            xyz@t-online.de,
            xyz@aliceadsl.fr,
            xyz@virgilio.it,
            xyz@home.nl,
            xyz@qq.com,
            xyz@telenet.be,
            xyz@me.com,
            xyz@yahoo.com.ar,
            xyz@tiscali.co.uk,
            xyz@yahoo.com.mx,
            xyz@mail.com,
            xyz@gmx.net,
            xyz@mail.com,
            xyz@planet.nl,
            xyz@tin.it,
            xyz@live.it,
            xyz@ntlworld.com,
            xyz@arcor.de,
            xyz@yahoo.co.id,
            xyz@frontiernet.net,
            xyz@hetnet.nl,
            xyz@live.com.au,
            xyz@yahoo.com.sg,
            xyz@zonnet.nl,
            xyz@club-internet.fr,
            xyz@juno.com,
            xyz@optusnet.com.au,
            xyz@blueyonder.co.uk,
            xyz@bluewin.ch,
            xyz@skynet.be,
            xyz@sympatico.ca,
            xyz@windstream.net,
            xyz@macramaswamy.com
            `;
            return chai.expect(EmailValidator.validate(data)).to.be.fulfilled
                    .and.to.eventually.have.all.keys('isValidDomain', 'erorrMessage', 'invalidEmailList')
            
        })

    });
});