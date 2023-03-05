import unittest
from findLongestWord import hellEreygaUguDheer

class TestStringMethods(unittest.TestCase):

    def test_3(self):
        self.assertEqual(hellEreygaUguDheer("Magaceygu waa Maxamed"), "Magaceygu")

    def test_45(self):
        self.assertEqual(hellEreygaUguDheer("Waxaan ku noolahay Soomaaliya"), "Soomaaliya")

    def test_801(self):
        self.assertEqual(hellEreygaUguDheer(456, 345), 801)

    def test__3(self):
        self.assertEqual(hellEreygaUguDheer("Maalmuhu waa 7ba"), "Maalmuhu")
if __name__ == '__main__':
    unittest.main()


