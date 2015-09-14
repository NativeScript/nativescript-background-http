var server = require("../../examples/www/server");

describe("tasks", function() {

	var www_instance;
	beforeEach(function(done) {
		// TODO: Use random open port.
		www_instance = server.start(8083, undefined);
		done();
	});

	afterEach(function(done) {
		www_instance.close();
		done();
	})

	it("report notifications", function() {
		var tree = this.browser;
		return tree
			// TODO: Provide the random open port to the app.
			.elementByName("Upload!")
			.then(function(button) { return button.click() })
			.then(function() { return tree.elementByXPath("//UIATableCell[@name='bigpic.jpg 1']") })
			.then(function(cell) {
				var status = tree.elementByXPath("//UIATableCell[@name='bigpic.jpg 1']/*[@value='status: uploading']")
					.then(function() { return tree.waitForElementByXPath("//UIATableCell[@name='bigpic.jpg 1']/*[@value='status: complete']", undefined, 10000, 100) });

				var progress = tree.elementByXPath("//UIATableCell[@name='bigpic.jpg 1']/UIAProgressIndicator") // TODO: Assert 0 ~ 33%, 33% ~ 66$, 66% ~99%...
					.then(function() { return tree.waitForElementByXPath("//UIATableCell[@name='bigpic.jpg 1']/UIAProgressIndicator[@value='100%']", undefined, 10000, 100); });
					// TODO: Assert the "www_instance" uploaded the file.


				return Promise.all([status, progress]);
			});
	});
});
