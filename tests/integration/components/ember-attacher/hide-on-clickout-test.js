import hbs from 'htmlbars-inline-precompile';
import { click, find, triggerEvent, waitUntil } from 'ember-native-dom-helpers';
import { isVisible } from 'ember-attacher';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('ember-attacher', 'Integration | Component | hideOn "clickout"', {
  integration: true
});

test('hides when an element outside the target is clicked', async function(assert) {
  assert.expect(3);

  this.render(hbs`
    <input type="text" id="focus-me"/>

    <div id="parent">
      {{#attach-popover id='attachment'
                        hideOn='clickout'
                        isShown=true}}
        hideOn click
      {{/attach-popover}}
    </div>
  `);

  const attachment = find('#attachment');

  assert.equal(isVisible(attachment), true, 'Initially shown');

  // Make sure the attachment is still shown when the target is clicked
  await click('#parent');

  assert.equal(isVisible(attachment), true, 'Still shown');

  await click('#focus-me');

  await waitUntil(() => isVisible(attachment) === false);

  assert.equal(isVisible(attachment), false, 'Now hidden');
});

test('with interactive=false: hides when attachment is clicked', async function(assert) {
  assert.expect(2);

  this.render(hbs`
    <div id="parent">
      {{#attach-popover id='attachment'
                        hideOn='clickout'
                        isShown=true}}
        hideOn click
      {{/attach-popover}}
    </div>
  `);

  const attachment = find('#attachment');

  assert.equal(isVisible(attachment), true, 'Initially shown');

  await click(attachment);

  assert.equal(isVisible(attachment), false, 'Now hidden');
});

test("with interactive=true: doesn't hide when attachment is clicked", async function(assert) {
  assert.expect(4);

  this.render(hbs`
    <input type="text" id="focus-me"/>

    <div id="parent">
      {{#attach-popover id='attachment'
                        hideOn='clickout'
                        interactive=true
                        isShown=true}}
        hideOn click
      {{/attach-popover}}
    </div>
  `);

  const attachment = find('#attachment');

  assert.equal(isVisible(attachment), true, 'Initially shown');

  // Make sure attachment stays shown when attachment clicked
  await click(attachment);

  assert.equal(isVisible(attachment), true, 'Still shown');

  // Make sure attachment stays shown when target clicked
  await click('#parent');

  assert.equal(isVisible(attachment), true, 'Still shown');

  // Make sure attachment is hidden once an element outside target or attachment is clicked
  await click('#focus-me');

  await waitUntil(() => isVisible(attachment) === false);

  assert.equal(isVisible(attachment), false, 'Now hidden');
});

// iOS specific test
test('hides when an element outside the target is tapped on iOS', async function(assert) {
  Object.defineProperty(navigator, 'userAgent', { value: 'iPhone' });

  assert.expect(3);

  this.render(hbs`
    <input type="text" id="focus-me"/>

    <div id="parent">
      {{#attach-popover id='attachment'
                        hideOn='clickout'
                        isShown=true}}
        hideOn click
      {{/attach-popover}}
    </div>
  `);

  const attachment = find('#attachment');

  assert.equal(isVisible(attachment), true, 'Initially shown');

  // Make sure the attachment is still shown when the target is tapped
  await triggerEvent('#parent', 'touchstart');
  await triggerEvent('#parent', 'touchend');

  assert.equal(isVisible(attachment), true, 'Still shown');

  await triggerEvent('#focus-me', 'touchstart');
  await triggerEvent('#focus-me', 'touchend');

  await waitUntil(() => isVisible(attachment) === false);

  assert.equal(isVisible(attachment), false, 'Now hidden');
});

// iOS specific test
test("doesn't hide when an element outside the target is swiped on iOS", async function(assert) {
  Object.defineProperty(navigator, 'userAgent', { value: 'iPhone' });

  assert.expect(2);

  this.render(hbs`
    <input type="text" id="focus-me"/>

    <div id="parent">
      {{#attach-popover id='attachment'
                        hideOn='clickout'
                        isShown=true}}
        hideOn click
      {{/attach-popover}}
    </div>
  `);

  const attachment = find('#attachment');

  assert.equal(isVisible(attachment), true, 'Initially shown');

  await triggerEvent('#focus-me', 'touchstart');
  await triggerEvent('#focus-me', 'touchmove');
  await triggerEvent('#focus-me', 'touchend');

  assert.equal(isVisible(attachment), true, 'Still shown');
});
