# knockout-extras
A collection of Knockout.js utils for various tasks

## Setup

```bash
npm install -g webpack
npm install
npm run compile
```

## Usage

Load the file `builder/index.js` in with your javascript, then:

```javascript
const _obs = ko.observable, _arr = ko.observableArray, _com = ko.computed;

class FormViewModel extends KOFormBase {
  reify(updated_record) {
    // this is called after a successful save (if save_after_edit is defined below)
    // updated_record is the response from the server
  }
  constructor(item_id) {
    super();
    this.beginInit({
      url: '/some/path',
      save_after_edit: {
        rate_limit: 1000,
        reify_method: 'reify'
      },
      request_opts: {data: 'will be encoded in the GET request for this URL'}
      other_requests: [
        {url: '/some/other/path', data: {this_data: 'will be encoded in the GET request for this URL'}},
        '/also/accepts/strings_for_urls'
      ],
      relationships: [
        {name: 'some_relationship', class: SomeRelationshipClass, nested_attributes_accepted: true, allow_destroy: true}
      ]
    }).then(() => {
      // This will be called after handleOtherRequests is done
      // You'll want to call this.finalizeInit()
      return this.finalizeInit();
    }).catch(err => {
      // Oh No!
      this.loading(false); // An observable that you can hook into from the view
      this.error_message(err); // An observable that you can hook into from the view. Any error that occurs during initialization will be passed here.
    });
  }
  init(item_response) {
    // This method is called automatically after beginInit finishes
    // Return a promise (that signals the resolution of handleOtherRequests)
    this.some_stuff = _arr([]);
    this.some_other_stuff = _arr([]);
    return super.init(item_response) // make sure you call super, and pass in item_response
    .then(() => {
      // Do whatevs. This will all happen before the handleOtherRequests function gets called
    });
  }

  handleOtherRequests(responses) {
    // the responses from other_requests above
    // no need to call super.handleOtherRequests(responses); all that does is returns an empty promise
    // responses === [some_other_path_response, also_accepts_strings_for_urls_response] (See other_requests above)
    // do stuff with these responses, then return a promise
    this.some_stuff(ko_extras.json_api_utils.parse_json_api_response(responses[0], {immybox: true}))
    this.some_other_stuff(ko_extras.json_api_utils.parse_json_api_response(responses[1], {
      immybox: {
        text: 'full_name',
        value: 'username'
      }
    }));
    return Promise.resolve();
  }

  finalizeInit() {
    return super.finalizeInit() // sets up numErrors, is_valid, etc.
    .then(() => {
      // Do whatevs. Make sure you set loading to false and apply KO bindings
      this.loading(false);
      ko.applyBindings(this);
    });
  }
}
```
