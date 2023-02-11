import unittest
from sum import sum

class TestStringMethods(unittest.TestCase):

    def test_3(self):
        self.assertEqual(sum(1,2), 3)

    def test_45(self):
        self.assertEqual(sum(18,27), 45)

    def test_801(self):
        self.assertEqual(sum(456, 345), 801)

    def test__3(self):
        self.assertEqual(sum(-1,-2), -3)
if __name__ == '__main__':
    unittest.main()

