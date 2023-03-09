import unittest
from isPrime import isPrime

class TestStringMethods(unittest.TestCase):

    def test_3(self):
        self.assertEqual(isPrime(5), True)

    def test_45(self):
        self.assertEqual(isPrime(19), True)

    def test_801(self):
        self.assertEqual(isPrime(100), False)

    def test__3(self):
        self.assertEqual(isPrime(213), False)
if __name__ == '__main__':
    unittest.main()


