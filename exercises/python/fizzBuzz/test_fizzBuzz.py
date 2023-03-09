import unittest
from fizzBuzz import fizzBuzz

class TestStringMethods(unittest.TestCase):

    def test_3(self):
        self.assertEqual(fizzBuzz(5), 'buzz')

    def test_45(self):
        self.assertEqual(fizzBuzz(15), 'fizzBuzz')

    def test_801(self):
        self.assertEqual(fizzBuzz(23), 23)

    def test__3(self):
        self.assertEqual(fizzBuzz(21), 'fizz')
if __name__ == '__main__':
    unittest.main()


