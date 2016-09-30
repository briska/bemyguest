import re
from datetime import datetime
import cStringIO as StringIO
from xhtml2pdf import pisa
from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
from cgi import escape

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

def to_datetime(srcDate):
    return datetime.strptime(srcDate, '%Y-%m-%d %H:%M:%S')

def render_to_pdf(template_src, filename, context_dict):
    template = get_template(template_src)
    context = Context(context_dict)
    html = template.render(context)
    result = StringIO.StringIO()

    pdf = pisa.pisaDocument(StringIO.StringIO(html.encode("UTF-8")), result, encoding='UTF-8')
    if not pdf.err:
        response = HttpResponse(result.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = 'filename="%s.pdf"' % (filename)
        return response
    return HttpResponse('We had some errors<pre>%s</pre>' % escape(html))
