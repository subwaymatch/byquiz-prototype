import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

const fsPromises = fs.promises;
const coursesPath = path.join(process.cwd(), 'content', 'course');

export interface ICourse {
  id: string;
  title: string;
  description: string;
  modules: string[];
}

export interface ICourseModule {
  title: string;
  pages: string[];
}

export interface ICourseModulePage {
  title: string;
  quizzes: string[];
  content: string;
}

export async function getCourseData(courseId): Promise<ICourse> {
  const courseYamlFilePath = path.join(coursesPath, courseId, '_course.yaml');

  if (!fs.existsSync(courseYamlFilePath)) {
    throw new Error(`_course.yaml for ${courseId} not found`);
  }

  const courseYaml = await fsPromises.readFile(courseYamlFilePath, {
    encoding: 'utf-8',
  });

  const courseData = YAML.parse(courseYaml);

  return { id: courseId, ...courseData };
}

export async function getAllCourses(): Promise<ICourse[]> {
  const fileNames = await fsPromises.readdir(coursesPath, {
    withFileTypes: true,
  });

  const courses = fileNames
    .filter((dirent) => dirent.isDirectory())
    .map(async (dirent) => {
      const courseData = await getCourseData(dirent.name);

      return courseData;
    });

  return Promise.all(courses);
}

export async function getCourseFirstModule(courseId) {}
