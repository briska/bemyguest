from django import template
from core.utils import can_read as user_can_read, can_edit as user_can_edit
register = template.Library()

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

@register.filter
def can_read(user):
    return user_can_read(user)

@register.filter
def can_edit(user):
    return user_can_edit(user)
