// components/DeleteDialog.tsx
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

type Props = {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    targetLabel: string;
    loading?: boolean;
    children?: React.ReactNode;
};

export default function DeleteQuestionModal({
    open,
    onClose,
    onDelete,
    targetLabel,
    loading,
    children,
}: Props) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{targetLabel}の削除</DialogTitle>
            <DialogContent>
                本当にこの{targetLabel}を削除しますか？この操作は取り消せません。
            </DialogContent>
            {children}
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    キャンセル
                </Button>
                <Button onClick={onDelete} color="error" disabled={loading}>
                    削除する
                </Button>
            </DialogActions>
        </Dialog>
    );
}
