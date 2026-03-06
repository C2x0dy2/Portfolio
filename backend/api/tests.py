from django.test import TestCase
from django.urls import reverse
from .models import Project, Skill, ContactMessage


class ProjectModelTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(
            name="Test Project",
            year="2024",
            description="A test project",
            type="web",
            category="web",
        ) 


        

    def test_project_str(self):
        self.assertEqual(str(self.project), "Test Project")

    def test_project_defaults(self):
        self.assertFalse(self.project.deployed)
        self.assertEqual(self.project.technologies, [])


class SkillModelTest(TestCase):
    def setUp(self):
        self.skill = Skill.objects.create(name="Python", level=90, category="languages")

    def test_skill_str(self):
        self.assertIn("Python", str(self.skill))

    def test_skill_level(self):
        self.assertEqual(self.skill.level, 90)


class ContactMessageModelTest(TestCase):
    def setUp(self):
        self.msg = ContactMessage.objects.create(
            name="Alice",
            email="alice@example.com",
            subject="Hello",
            message="Test message",
        )

    def test_contact_str(self):
        self.assertIn("Alice", str(self.msg))

    def test_is_read_default(self):
        self.assertFalse(self.msg.is_read)


class ProjectAPITest(TestCase):
    def test_projects_list_returns_200(self):
        response = self.client.get("/api/projects/")
        self.assertEqual(response.status_code, 200)

    def test_skills_list_returns_200(self):
        response = self.client.get("/api/skills/")
        self.assertEqual(response.status_code, 200)

    def test_contact_post(self):
        data = {
            "name": "Bob",
            "email": "bob@example.com",
            "subject": "Hi",
            "message": "Hello there",
        }
        response = self.client.post("/api/contact/", data, content_type="application/json")
        self.assertIn(response.status_code, [200, 201])


