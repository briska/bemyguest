import re

first_cap_re = re.compile('(.)([A-Z][a-z]+)')
all_cap_re = re.compile('([a-z0-9])([A-Z])')

def convert(name):
    s1 = first_cap_re.sub(r'\1_\2', name)
    return all_cap_re.sub(r'\1_\2', s1).lower()

def convert_dict_keys(obj):
    converted_obj = {}
    if isinstance(obj, dict):
        for key, value in obj.iteritems():
            converted_obj[convert(key)] = value
    return converted_obj

def convert_dict_keys_deep(obj):
    if isinstance(obj, dict):
        converted_obj = {}
        for key, value in obj.iteritems():
            converted_obj[convert(key)] = convert_dict_keys_deep(value)
        return converted_obj
    elif isinstance(obj, list):
        converted_obj = []
        for value in obj:
            converted_obj.append(convert_dict_keys_deep(value))
        return converted_obj
    return obj