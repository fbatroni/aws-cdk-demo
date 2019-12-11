#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkStack } from '../lib/cdk-stack';
import { PreCdkStack } from '../lib/pre-cdk-stack';

import { account, region } from '../../service/config';

const app = new cdk.App();
new CdkStack(app, 'AwsCommunityDay', {
    env: {
        account: account,
        region: region
    }
});

