#!/usr/bin/env python3
from database import Database

db = Database()

sample = {
    'id': 101,
    'title': 'Dars 101 - Test Video',
    'intro': 'Bu test darsining qisqacha tavsifi',
    'video_id': 'ABC123XYZtest',
    'summary': 'To‘liq test darsining izohi va maqsadi',
    'resources': [
        {'name': 'Resurs 1', 'url': 'https://example.com/resource1'},
        {'name': 'Resurs 2', 'url': 'https://example.com/resource2'}
    ],
    'downloads': [
        {'name': 'Presentation.pdf', 'url': '/files/lesson101/presentation.pdf'},
        {'name': 'Checklist.xlsx', 'url': '/files/lesson101/checklist.xlsx'}
    ]
}

print('Inserting sample lesson...')

db.create_or_update_lesson(sample['id'], sample['title'], sample['intro'], sample['video_id'], sample['summary'], sample['resources'], sample['downloads'])

print('Done. Use GET http://localhost:3000/api/lessons/101 to retrieve it.')
