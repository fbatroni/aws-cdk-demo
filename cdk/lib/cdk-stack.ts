import cdk = require('@aws-cdk/core');
import * as ec2 from "@aws-cdk/aws-ec2";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this,"vpc", {
       maxAzs:2,
       cidr:"172.100.0.0/16"
    })

  }
}
