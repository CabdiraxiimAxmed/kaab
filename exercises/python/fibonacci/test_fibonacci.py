import unittest
from fibonacci import fib

class TestStringMethods(unittest.TestCase):

    def test_3(self):
        self.assertEqual(fib(2), 2)

    def test_45(self):
        self.assertEqual(fib(13), 377)

    def test_801(self):
        self.assertEqual(fib(33), 5702887)

    def test__3(self):
        self.assertEqual(fib(39), 102334155)
if __name__ == '__main__':
    unittest.main()


