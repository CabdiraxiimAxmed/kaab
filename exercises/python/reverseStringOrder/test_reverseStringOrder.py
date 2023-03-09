import unittest
from reverseStringOrder import dibUHabeeEreyada

class TestStringMethods(unittest.TestCase):

    def test_3(self):
        self.assertEqual(dibUHabeeEreyada("Magaceygu waa Maxamed"), "Maxamed waa Magaceygu")

    def test_45(self):
        self.assertEqual(dibUHabeeEreyada("Waxaan ku noolahay Soomaaliya"), "Soomaaliya noolahay ku Waxaan")

    def test_801(self):
        self.assertEqual(dibUHabeeEreyada("Maalmuhu waa 7ba"), "7ba waa Maalmuhu")

if __name__ == '__main__':
    unittest.main()


