import jmespath
from jmespath import functions


# ================================================================
#                       CUSTOM FUNCTIONS
# ================================================================
class ExtendedFunctions(functions.Functions):
    # -------- to_entries --------
    @functions.signature({'types': ['object']})
    def _func_to_entries(self, obj):
        """
        Converts an object into an array of {key, value} pairs.
        Equivalent to AWS's to_entries().
        """
        return [{"key": k, "value": v} for k, v in obj.items()]

    # -------- from_entries --------
    @functions.signature({'types': ['array']})
    def _func_from_entries(self, arr):
        """
        Converts an array of {key, value} into an object.
        """
        result = {}
        for item in arr:
            if isinstance(item, dict) and "key" in item and "value" in item:
                result[item["key"]] = item["value"]
        return result

    # -------- keys --------
    @functions.signature({'types': ['object']})
    def _func_keys(self, obj):
        """
        Returns the object's keys as an array.
        """
        return list(obj.keys())

    # -------- values --------
    @functions.signature({'types': ['object']})
    def _func_values(self, obj):
        """
        Returns the object's values as an array.
        """
        return list(obj.values())

    # -------- contains_key --------
    @functions.signature({'types': ['object', 'string']})
    def _func_contains_key(self, obj, key):
        """
        Check whether an object contains a key.
        """
        return key in obj

    # -------- sort_by_number --------
    @functions.signature({'types': ['array', 'expression']})
    def _func_sort_by_number(self, arr, expr):
        """
        Numeric sorting using a sub-expression.
        Example: sort_by_number(objects, &to_number(field))
        """
        results = []
        for element in arr:
            v = expr.visit(element)
            try:
                vnum = float(v)
            except Exception:
                vnum = None
            results.append((vnum, element))

        # sort by numeric key (None goes last)
        sorted_items = sorted(results, key=lambda x: (x[0] is None, x[0]))
        return [el for (_, el) in sorted_items]

    # -------- deep_get --------
    @functions.signature({'types': ['object', 'string']})
    def _func_deep_get(self, obj, path):
        """
        Naive deep-get: retrieve nested object values using "a.b.c".
        """
        keys = path.split(".")
        current = obj
        for key in keys:
            if not isinstance(current, dict) or key not in current:
                return None
            current = current[key]
        return current


# ================================================================
#                       CUSTOM PARSER
# ================================================================
class ExtendedParser(jmespath.parser.Parser):
    def __init__(self):
        super().__init__()
        self.functions = ExtendedFunctions()


# ================================================================
#                  MAIN ENTRY POINT FOR USER
# ================================================================
def jmes_search(expr, data):
    """
    Execute a JMESPath expression using the Extended JMESPath engine.
    """
    parser = ExtendedParser()
    ast = parser.parse(expr)
    return ast.search(data, options=jmespath.Options(custom_functions=ExtendedFunctions()))
