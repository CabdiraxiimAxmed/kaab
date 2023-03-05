import unittest
from matchBrackets import maSimanYihiin

class TestStringMethods(unittest.TestCase):

    def test_3(self):
        self.assertEqual(maSimanYihiin("({[})]"), True)

    def test_45(self):
        self.assertEqual(maSimanYihiin("{]{{{{(((())))}}}}[[]"), False)

    def test_801(self):
        self.assertEqual(maSimanYihiin("(}){[]{}"), True)

    def test__3(self):
        self.assertEqual(maSimanYihiin("]]]()))}}}}{{{[[["), False)
if __name__ == '__main__':
    unittest.main()


