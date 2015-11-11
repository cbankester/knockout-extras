# Knockout.js JSON API Utils
A collection of Knockout.js utils for various tasks related to JSON API standard

## Setup

```bash
npm install
npm run compile
```

## Usage

Load the file `build/index.js` in with your javascript, then:

```javascript

// Sometime before initializing a `KOFormBase`, `Object.assign` the provided
// extenders to `ko.extenders` by calling:
KnockoutJsonApiUtils.setupExtenders();

class FormViewModel extends KnockoutJsonApiUtils.KOFormBase {
  reify(updated_record) {
    // this is called after a successful save (if save_after_edit is defined below)
    // updated_record is the response from the server
  }
  constructor(item_id) {
    super();

    // Set up some observables we'll need later on
    this.some_stuff = _arr([]);
    this.some_other_stuff = _arr([]);

    // `this.init(opts)` consists of a chain of promises:
    // -> await parallel execution of requests & nested vm creation
    // -> parse response to main request & build `VM` (i.e. `this`) by doing:
    //     1. strip out attributes form response
    //     2. create `VM[attribute_name]` extended observable (as defined in
    //        Extensions) for each attribute not in
    //        `opts.obseravble_attributes_blacklist` and push into
    //        `VM.observables_list` observableArray
    //     3. create `VM[relationship_name]` extended observable or
    //        observableArray (as defined in Extensions) for each relationship
    //        specified in `opts.relationships` and push into `VM.relationships`
    //        observableArray
    // -> await parallel execution of `handleOtherResponses` & `finalizeInit`
    this.init({
      url: `/some/path/${item_id}`,
      request_opts: {format: 'json'},
      save_after_edit: {
        rate_limit: 2000 // configure auto-saving to happen 2 seconds after changes stop
        reify_method: 'reify' // method to call when the server responds to a save
      },
      observable_attributes_blacklist: [
        'some_attribute' // these attributes won't be extended like all the other attributes that we received from the server
      ],
      relationships: [
        {
          name: 'some_child_relationship',
          class: ChildRelationship,
          nested_attributes_accepted: true,
          allow_destroy: true,
          blank_value: @blankChildRelationship
        }
      ],
      other_requests: [
        '/some/other/request/to/perform'
        {url: '/yet/another/request', request_opts: {foo: 'bar'}} // request_opts will be url-encoded into the GET request
      ],
      // Other VMs that we may want to instanciate alongside this one.
      // Basically just calls the constructors and assigns the value to `this[some_nested_vm]`
      nested_vms: new Map().set 'some_nested_vm', new NestedViewModel()
    }).then(() => {
      this.loading(false);
      ko.applyBindings(this);
    }).catch(err => {
      // Oh No!
      this.loading(false); // An observable that you can hook into from the view
      this.error_message(err); // An observable that you can hook into from the view. Any error that occurs during initialization will be passed here.
    });
  }

  handleOtherRequests(responses) {
    // the responses from other_requests above
    // no need to call super.handleOtherRequests(responses); all that does is returns an empty promise
    // responses === [response1, response2] (see other_requests above)
    // If a promise is returned, it will be resolved before `this.finalizeInit()` is called
    this.some_stuff(json_api_utils.parse_json_api_response(responses[0], {immybox: true}))
    this.some_other_stuff(json_api_utils.parse_json_api_response(responses[1], {
      immybox: {
        text: 'full_name',
        value: 'username'
      }
    }));
  }

  finalizeInit() {
    // stuff before finalizing
    super.finalizeInit() // sets up numErrors, is_valid, etc.
    // stuff after finalizing
    // If a promise is returned, it will be resolved before `this.init()` resolves
  }
}
```
