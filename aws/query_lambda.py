import boto3
import json
import decimal
from boto3.dynamodb.conditions import Key

GET_PROJECT = "get-project"
GET_LATEST = "get-latest"
GET_BLOG = "get-blog"


def decimal_default(obj):
    """
    Helps decode a decimal.
    :param obj:
    :return:
    """
    if isinstance(obj, decimal.Decimal):
        return int(obj)
    raise TypeError


def lambda_handler(event, context):
    end_point = event['resource'].rsplit('/', 1)[-1]
    if end_point == GET_PROJECT:
        return get_project(event)
    elif end_point == GET_LATEST:
        return get_latest()
    elif end_point == GET_BLOG:
        return get_project(event)
    else:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'reason': 'Invalid API request.'
            }),
            'isBase64Encoded': False
        }

def check_query_range(event):
    """
    Helper function used to check the query range before sending it off.
    :param event: The context of the request.
    :return: None if everything was successful, otherwise a lambda response.
    """
    if event['queryStringParameters']['start'] >= event['queryStringParameters']['end']:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'reason': 'Invalid API request.'
            }),
            'isBase64Encoded': False
        }
    return None

def get_latest():
    """
    Gets the latest indexes for the blog and project list.
    :return: The latest indices.
    """
    client = boto3.resource('dynamodb')
    latest_table = client.Table('personal-website-latest')
    blog_response = latest_table.query(
        KeyConditionExpression=Key('latest-index').eq('blog')
    )
    project_response = latest_table.query(
        KeyConditionExpression=Key('latest-index').eq('project')
    )
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'latest-project': project_response['Items'][0]['project-id'],
            'latest-blog': blog_response['Items'][0]['blog-id']
        }, default=decimal_default),
        'isBase64Encoded': False
    }


def get_project(event):
    """
    Gets the projects from the given start and end range.
    :param event: The context passed to the lambda.
    :return: The HTTP response.
    """
    if check_query_range(event) is not None:
        return check_query_range(event)

    client = boto3.resource('dynamodb')
    personal_website_table = client.Table('personal-website')

    results = []
    start = int(event['queryStringParameters']['start'])
    end = int(event['queryStringParameters']['end'])
    for i in range(start, end):
        result = personal_website_table.query(
            IndexName='projects_index',
            KeyConditionExpression=Key('project-id').eq(i)
        )

        if len(result['Items']) == 0:
            break
        results.append(result['Items'][0])

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(results, default=decimal_default),
        'isBase64Encoded': False
    }


def get_blog(event):
    """
    Gets the blogs from the given start and end range.
    :param event: The context passed to the lambda.
    :return: The HTTP response.
    """
    if check_query_range(event) is not None:
        return check_query_range(event)

    client = boto3.resource('dynamodb')
    personal_website_table = client.Table('personal-website')
    results = []
    start = int(event['queryStringParameters']['start'])
    end = int(event['queryStringParameters']['end'])
    for i in range(start, end):
        result = personal_website_table.query(
            IndexName='blog_index',
            KeyConditionExpression=Key('blog-id').eq(0)
        )

        if len(result['Items']) == 0:
            break
        results.append(result['Items'][0])

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(results, default=decimal_default),
        'isBase64Encoded': False
    }


if __name__ == "__main__":
    event = {
        "resource": "/get-project",
        "queryStringParameters": {
            "start": 0,
            "end": 5
        },
    }

    print(str(lambda_handler(event, None)))
