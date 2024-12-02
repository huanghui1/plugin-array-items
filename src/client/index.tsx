import { Plugin } from '@nocobase/client';
import { Page } from './Page';
import React from 'react';

export class PluginArrayItemsClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    console.log(this.app);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
    this.app.router.add('admin.test.array-items', {
      path: '/admin/test/array-items',
      // element: <Page />,
      Component: () => <Page />,
    });
  }
}

export default PluginArrayItemsClient;
