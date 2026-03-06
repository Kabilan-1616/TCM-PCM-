import requests
import logging
import time
from django.conf import settings

logger = logging.getLogger(__name__)


def sync_project_to_tcm(project, retries=3, delay=1):
    for attempt in range(1, retries + 1):
        try:
            response = requests.post(
                f"{settings.TCM_BASE_URL}/api/projects/sync/",
                json={
                    "taiga_project_id": project.id,
                    "name": project.name,
                    "description": project.description,
                    # ✅ Send all TCM fields
                    "prefix": project.prefix,
                    "enable_requirements": project.enable_requirements,
                    "enable_testing_priority": project.enable_testing_priority,
                    "enable_test_automation": project.enable_test_automation,
                    "enable_inventory": project.enable_inventory,
                    "project_active": project.project_active,
                },
                headers={
                    "Content-Type": "application/json",
                    "X-Internal-Token": settings.INTERNAL_SYNC_TOKEN,
                },
                timeout=5,
            )
            response.raise_for_status()
            logger.info(f"✅ Synced project {project.id} to TCM on attempt {attempt}")
            return response.json()
        except requests.RequestException as e:
            logger.warning(f"⚠️ Attempt {attempt} failed for project {project.id}: {e}")
            if attempt < retries:
                time.sleep(delay)
            else:
                logger.error(f"❌ All {retries} attempts failed for project {project.id}")
                return None


def fetch_issues_from_tcm(taiga_project_id):
    try:
        response = requests.get(
            f"{settings.TCM_BASE_URL}/api/issues/by-taiga-project/{taiga_project_id}/",
            headers={"X-Internal-Token": settings.INTERNAL_SYNC_TOKEN},
            timeout=5,
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        logger.error(f"Failed to fetch issues for project {taiga_project_id}: {e}")
        return []