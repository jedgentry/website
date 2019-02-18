import boto3

dynamo = boto3.resource('dynamodb')

# Create our table.
table = dynamo.create_table(
    TableName='personal-website',
    KeySchema=[
        {
            'AttributeName': 'content-id',
            'KeyType': 'HASH'
        }
    ],
    GlobalSecondaryIndexes=[
        {
            'IndexName': "projects_index",
            'KeySchema': [
                {
                    'AttributeName': 'project-id',
                    'KeyType': 'HASH'
                },
                {
                    'AttributeName': 'content-id',
                    'KeyType': 'RANGE',
                }
            ],
            'Projection': {
                'ProjectionType': 'KEYS_ONLY'
            },
            'ProvisionedThroughput': {
                'ReadCapacityUnits': 2,
                'WriteCapacityUnits': 1
            }
        },
        {
            'IndexName': "blog_index",
            'KeySchema': [
                {
                    'AttributeName': 'blog-id',
                    'KeyType': 'HASH'
                },
                {
                    'AttributeName': 'content-id',
                    'KeyType': 'RANGE',
                },
            ],
            'Projection': {
                'ProjectionType': 'KEYS_ONLY'
            },
            'ProvisionedThroughput': {
                'ReadCapacityUnits': 2,
                'WriteCapacityUnits': 1
            }
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'content-id',
            'AttributeType': 'N'
        },
        {
            'AttributeName': 'blog-id',
            'AttributeType': 'N'
        },
        {
            'AttributeName': 'project-id',
            'AttributeType': 'N'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 1,
        'WriteCapacityUnits': 1
    }
)

# Wait for table creation to complete.
table.meta.client.get_waiter('table_exists').wait(TableName='personal-website')
