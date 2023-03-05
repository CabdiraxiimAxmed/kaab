import unittest
from capitalizeWords import weyneyXarfkaUguHoreeya

class TestStringMethods(unittest.TestCase):

    def test_3(self):
        self.assertEqual(weyneyXarfkaUguHoreeya("magaceygu waa maxamed"), "Magaceygu Waa Maxamed")

    def test_45(self):
        self.assertEqual(weyneyXarfkaUguHoreeya("waxaan ahay arday"), "Waxaan Ahay Arday")

    def test_801(self):
        self.assertEqual(weyneyXarfkaUguHoreeya("waan jeclahay dalkeyga"), "Waan Jeclahay Dalkeyga")
if __name__ == '__main__':
    unittest.main()
