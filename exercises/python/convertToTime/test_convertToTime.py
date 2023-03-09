import unittest
from convertToTime import ubedelWaqti

class TestStringMethods(unittest.TestCase):

    def test_3(self):
        self.assertEqual(ubedelWaqti(359999), '99:59:59')

    def test_45(self):
        self.assertEqual(ubedelWaqti(1000), "00:16:40")

    def test_801(self):
        self.assertEqual(ubedelWaqti(3600), "01:00:00")

if __name__ == '__main__':
    unittest.main()


