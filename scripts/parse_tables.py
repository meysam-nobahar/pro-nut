"""Parse the raw WordPress nutrition tables into aligned English-only rows."""
import re
from html.parser import HTMLParser

class T(HTMLParser):
    def __init__(s):
        super().__init__(); s.tables=[]; s.row=None; s.cell=None; s.buf=''
    def flush(s):
        if s.cell is not None:
            t=re.sub(r'\s+',' ',s.buf.replace('\xa0',' ')).strip()
            if t: s.cell.append(t)
        s.buf=''
    def handle_starttag(s,tag,a):
        if tag=='table': s.tables.append([])
        elif tag=='tr' and s.tables: s.row=[]; s.tables[-1].append(s.row)
        elif tag in('td','th') and s.row is not None: s.cell=[]; s.buf=''; s.row.append(s.cell)
        elif tag in('p','br'): s.flush()
    def handle_endtag(s,tag):
        if tag in('td','th'): s.flush(); s.cell=None
        elif tag=='p': s.flush()
    def handle_data(s,d):
        if s.cell is not None: s.buf+=d

def raw_tables(html):
    p=T(); p.feed(html); return p.tables

def english(label):
    """Keep the English half of 'English / Polski'."""
    return re.sub(r'\s+',' ',label.split(' / ')[0].split('/ ')[0]).strip().strip('/').strip()
