import unittest
from addArrayNumbers import iskuDarTiradaArrayda

class TestStringMethods(unittest.TestCase):

    def test_3(self):
        self.assertEqual(iskuDarTiradaArrayda([1, 2, 53, 53, 2, 12]), 123)

    def test_45(self):
        self.assertEqual(iskuDarTiradaArrayda([3, 2]), 5)

    def test_801(self):
        self.assertEqual(iskuDarTiradaArrayda([4, 8, 90, 6, 7]), 115)

if __name__ == '__main__':
    unittest.main()


