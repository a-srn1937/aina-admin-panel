'use client';

import { toast } from 'sonner';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import {
  useGetIndexes,
  useDeleteTest,
  useGetTestById,
  useDeleteQuestion,
  useUpdateQuestion,
  useGetQuestionsByTest,
} from 'src/api';

import { Iconify } from 'src/components/iconify';

import { TestServicesList } from 'src/sections/services';

import { QuestionForm } from '../components/question-form';
import { TestEditForm } from '../components/test-edit-form';
import { TestTagsManager } from '../components/test-tags-manager';
import { TestVariantsManager } from '../components/test-variants-manager';
import { QuestionVariantsManager } from '../components/question-variants-manager';
import { TestVariantEditForm, QuestionVariantEditForm } from '../components/variant-edit-form';

// ----------------------------------------------------------------------

export function TestDetailsView({ testId }) {
  const [tab, setTab] = useState(0);
  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [openEditTest, setOpenEditTest] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [editingTestVariant, setEditingTestVariant] = useState(null);
  const [openTestVariantsManager, setOpenTestVariantsManager] = useState(false);

  const router = useRouter();
  const { data: test, isLoading: testLoading, refetch: refetchTest } = useGetTestById(testId);
  const {
    data: questionsData,
    isLoading: questionsLoading,
    refetch: refetchQuestions,
  } = useGetQuestionsByTest(testId);
  const { data: indexesData } = useGetIndexes();

  const { mutateAsync: deleteQuestion } = useDeleteQuestion();
  const { mutateAsync: deleteTest, isPending: isDeleting } = useDeleteTest();

  const questions = questionsData || [];
  const indexes = indexesData?.data || indexesData || [];

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('آیا از حذف این سوال اطمینان دارید؟')) return;
    try {
      await deleteQuestion(questionId);
      toast.success('سوال حذف شد');
      refetchQuestions();
    } catch (error) {
      toast.error('خطا در حذف سوال');
    }
  };

  const handleDeleteTest = async () => {
    try {
      await deleteTest(testId);
      toast.success('آزمون با موفقیت حذف شد');
      router.push(paths.dashboard.test.root);
    } catch (error) {
      toast.error('خطا در حذف آزمون');
    }
  };

  if (testLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!test) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>آزمون یافت نشد</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Button
            component={RouterLink}
            href={paths.dashboard.test.root}
            startIcon={<Iconify icon="mdi:arrow-right" />}
            sx={{ mb: 1 }}
          >
            بازگشت به لیست
          </Button>
          <Typography variant="h4">{test.variants?.[0]?.title || test.slug}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="mdi:pencil" />}
            onClick={() => setOpenEditTest(true)}
          >
            ویرایش آزمون
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Iconify icon="mdi:delete" />}
            onClick={() => setOpenDeleteConfirm(true)}
          >
            حذف آزمون
          </Button>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="اطلاعات آزمون" />
        <Tab label={`سوالات (${questions.length})`} />
        <Tab label="سرویس‌ها" />
        <Tab label="تگ‌ها" />
      </Tabs>

      {tab === 0 && (
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`شناسه: ${test.id}`} />
              <Chip label={`Slug: ${test.slug}`} />
              <Chip
                label={test.is_active ? 'فعال' : 'غیرفعال'}
                color={test.is_active ? 'success' : 'default'}
              />
              <Chip label={`ترتیب: ${test.order}`} variant="outlined" />
              <Chip
                label={
                  test.allow_partner_generate_report
                    ? 'ساخت کارنامه بدون تایید: فعال'
                    : 'ساخت کارنامه بدون تایید : غیر فعال'
                }
                color={test.allow_partner_generate_report ? 'info' : 'default'}
                variant="outlined"
              />
            </Box>

            {test.min_participants > 0 && (
              <Typography>
                تعداد شرکت‌کنندگان: {test.min_participants} تا {test.max_participants} نفر
              </Typography>
            )}

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">ترجمه‌ها (Variants)</Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Iconify icon="mdi:translate" />}
                onClick={() => setOpenTestVariantsManager(true)}
              >
                مدیریت کلی ترجمه‌ها
              </Button>
            </Box>

            {test.variants?.map((variant, index) => (
              <Box
                key={variant.id || index}
                sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
              >
                <Stack spacing={1}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={variant.language?.name || `زبان ${variant.language_id}`}
                        size="small"
                      />
                      <Chip
                        label={variant.variant_type === 'self' ? 'خود' : 'دیگری'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Tooltip title="ویرایش ترجمه">
                      <IconButton size="small" onClick={() => setEditingTestVariant(variant)}>
                        <Iconify icon="mdi:pencil" width={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="subtitle1">{variant.title}</Typography>
                  {variant.subtitle && (
                    <Typography variant="body2" color="text.secondary">
                      {variant.subtitle}
                    </Typography>
                  )}
                  {variant.description && (
                    <Typography variant="body2">{variant.description}</Typography>
                  )}
                  {variant.invitation_text && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'warning.lighter', borderRadius: 1 }}>
                      <Typography variant="caption" color="warning.dark">
                        متن دعوت:
                      </Typography>
                      <Typography variant="body2">{variant.invitation_text}</Typography>
                    </Box>
                  )}
                  {variant.telegram_text && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'primary.lighter', borderRadius: 1 }}>
                      <Typography variant="caption" color="primary.dark">
                        متن تلگرام:
                      </Typography>
                      <Typography variant="body2">{variant.telegram_text}</Typography>
                    </Box>
                  )}
                  {variant.start_text && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'success.lighter', borderRadius: 1 }}>
                      <Typography variant="caption" color="success.dark">
                        متن شروع:
                      </Typography>
                      <Typography variant="body2">{variant.start_text}</Typography>
                    </Box>
                  )}
                  {variant.end_text && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'info.lighter', borderRadius: 1 }}>
                      <Typography variant="caption" color="info.dark">
                        متن پایان:
                      </Typography>
                      <Typography variant="body2">{variant.end_text}</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Card>
      )}

      {/* Tab 1: Questions */}
      {tab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:plus" />}
              onClick={() => setOpenAddQuestion(true)}
            >
              افزودن سوال
            </Button>
          </Box>

          {questionsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : questions.length === 0 ? (
            <Card sx={{ p: 5, textAlign: 'center' }}>
              <Typography color="text.secondary">سوالی یافت نشد</Typography>
            </Card>
          ) : (
            <Stack spacing={2}>
              {questions.map((question, qIndex) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={qIndex}
                  testId={testId}
                  onDelete={() => handleDeleteQuestion(question.id)}
                  onRefetch={refetchQuestions}
                />
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Tab 2: Services */}
      {tab === 2 && (
        <Card sx={{ p: 3 }}>
          <TestServicesList testId={testId} />
        </Card>
      )}

      {/* Tab 3: Tags */}
      {tab === 3 && <TestTagsManager testId={testId} />}

      {/* Add Question Dialog */}
      <Dialog
        open={openAddQuestion}
        onClose={() => setOpenAddQuestion(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>افزودن سوال جدید</DialogTitle>
        <DialogContent>
          <QuestionForm
            testId={testId}
            indexOptions={indexes}
            onSuccess={() => {
              setOpenAddQuestion(false);
              refetchQuestions();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Test Dialog */}
      <Dialog open={openEditTest} onClose={() => setOpenEditTest(false)} maxWidth="md" fullWidth>
        <DialogTitle>ویرایش آزمون</DialogTitle>
        <DialogContent>
          <TestEditForm
            test={test}
            onSuccess={() => {
              setOpenEditTest(false);
              refetchTest();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
        <DialogTitle>تأیید حذف آزمون</DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف آزمون «{test.variants?.[0]?.title || test.slug}» اطمینان دارید؟
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            این عملیات غیرقابل بازگشت است و تمام سوالات و گزینه‌های مرتبط نیز حذف خواهند شد.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)}>انصراف</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteTest}
            disabled={isDeleting}
          >
            {isDeleting ? 'در حال حذف...' : 'حذف آزمون'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Test Variant Dialog */}
      <Dialog
        open={!!editingTestVariant}
        onClose={() => setEditingTestVariant(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>ویرایش ترجمه آزمون</DialogTitle>
        <DialogContent>
          {editingTestVariant && (
            <TestVariantEditForm
              variant={editingTestVariant}
              onSuccess={() => {
                setEditingTestVariant(null);
                refetchTest();
              }}
              onCancel={() => setEditingTestVariant(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openTestVariantsManager}
        onClose={() => setOpenTestVariantsManager(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>مدیریت کلی ترجمه‌های آزمون</DialogTitle>
        <DialogContent>
          <TestVariantsManager
            testId={testId}
            existingVariants={test?.variants || []}
            onSuccess={() => {
              setOpenTestVariantsManager(false);
              refetchTest();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTestVariantsManager(false)}>بستن</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ----------------------------------------------------------------------

function QuestionCard({ question, index, testId, onDelete, onRefetch }) {
  const [expanded, setExpanded] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [openQuestionVariantsManager, setOpenQuestionVariantsManager] = useState(false);
  const [openEditQuestion, setOpenEditQuestion] = useState(false);
  const [editLogicType, setEditLogicType] = useState(question.logic_type || '');
  const [isSaving, setIsSaving] = useState(false);

  const { mutateAsync: updateQuestion } = useUpdateQuestion();

  const handleSaveLogicType = async () => {
    setIsSaving(true);
    try {
      await updateQuestion({
        id: question.id,
        data: { logic_type: editLogicType || undefined },
      });
      toast.success('تایپ منطق ذخیره شد');
      setOpenEditQuestion(false);
      onRefetch?.();
    } catch (error) {
      toast.error('خطا در ذخیره');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<Iconify icon="mdi:chevron-down" />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
          <Chip label={`#${index + 1}`} size="small" />
          <Typography sx={{ flex: 1 }}>
            {question.variants?.[0]?.text?.substring(0, 80) || 'بدون متن'}
            {question.variants?.[0]?.text?.length > 80 ? '...' : ''}
          </Typography>
          {question.logic_type && (
            <Chip label={`تایپ: ${question.logic_type}`} size="small" color="info" />
          )}
          <Chip
            label={question.is_active ? 'فعال' : 'غیرفعال'}
            size="small"
            color={question.is_active ? 'success' : 'default'}
          />
          <Tooltip title="ویرایش سوال">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setEditLogicType(question.logic_type || '');
                setOpenEditQuestion(true);
              }}
            >
              <Iconify icon="mdi:pencil" />
            </IconButton>
          </Tooltip>
          <Tooltip title="مدیریت گزینه‌ها">
            <IconButton
              component={RouterLink}
              href={paths.dashboard.test.questionOptions(testId, question.id)}
              size="small"
              color="primary"
              onClick={(e) => e.stopPropagation()}
            >
              <Iconify icon="mdi:format-list-checks" />
            </IconButton>
          </Tooltip>
          <Tooltip title="حذف سوال">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Iconify icon="mdi:delete" />
            </IconButton>
          </Tooltip>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2">ترجمه‌های سوال:</Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Iconify icon="mdi:translate" />}
              onClick={() => setOpenQuestionVariantsManager(true)}
            >
              مدیریت کلی ترجمه‌ها
            </Button>
          </Box>
          {question.variants?.map((v, i) => (
            <Box key={i} sx={{ p: 1, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  mb: 1,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label={v.language?.name || `زبان ${v.language_id}`} size="small" />
                  <Chip
                    label={v.variant_type === 'self' ? 'خود' : 'دیگری'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Tooltip title="ویرایش ترجمه">
                  <IconButton size="small" onClick={() => setEditingVariant(v)}>
                    <Iconify icon="mdi:pencil" width={16} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography>{v.text}</Typography>
            </Box>
          ))}

          {/* Edit Question Variant Dialog */}
          <Dialog
            open={!!editingVariant}
            onClose={() => setEditingVariant(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>ویرایش ترجمه سوال</DialogTitle>
            <DialogContent>
              {editingVariant && (
                <QuestionVariantEditForm
                  variant={editingVariant}
                  onSuccess={() => {
                    setEditingVariant(null);
                    onRefetch?.();
                  }}
                  onCancel={() => setEditingVariant(null)}
                />
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openQuestionVariantsManager}
            onClose={() => setOpenQuestionVariantsManager(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>مدیریت کلی ترجمه‌های سوال</DialogTitle>
            <DialogContent>
              <QuestionVariantsManager
                questionId={question.id}
                existingVariants={question?.variants || []}
                onSuccess={() => {
                  setOpenQuestionVariantsManager(false);
                  onRefetch?.();
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenQuestionVariantsManager(false)}>بستن</Button>
            </DialogActions>
          </Dialog>

          {/* Edit Question Logic Type Dialog */}
          <Dialog
            open={openEditQuestion}
            onClose={() => setOpenEditQuestion(false)}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>ویرایش تایپ منطق سوال</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="تایپ منطق"
                value={editLogicType}
                onChange={(e) => setEditLogicType(e.target.value.toUpperCase())}
                placeholder="A-Z"
                inputProps={{ maxLength: 1 }}
                helperText="یک حرف بزرگ انگلیسی (A-Z)"
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditQuestion(false)}>انصراف</Button>
              <Button variant="contained" onClick={handleSaveLogicType} disabled={isSaving}>
                {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
              </Button>
            </DialogActions>
          </Dialog>

          <Divider />

          <Typography variant="subtitle2">گزینه‌ها:</Typography>
          {question.options?.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ترتیب</TableCell>
                    <TableCell>متن</TableCell>
                    <TableCell>امتیاز</TableCell>
                    <TableCell>وضعیت</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {question.options.map((opt) => (
                    <TableRow key={opt.id}>
                      <TableCell>{opt.order}</TableCell>
                      <TableCell>{opt.variants?.[0]?.text || '-'}</TableCell>
                      <TableCell>{opt.score}</TableCell>
                      <TableCell>
                        <Chip
                          label={opt.is_active ? 'فعال' : 'غیرفعال'}
                          size="small"
                          color={opt.is_active ? 'success' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">گزینه‌ای تعریف نشده</Typography>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
